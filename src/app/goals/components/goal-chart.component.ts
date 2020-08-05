import { Component, OnInit, OnChanges, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Goal, WorkoutService, ProfileService, Profile, ProfileWeight, Workout } from '../../api-common';


@Component({
  selector: 'app-goal-chart',
  templateUrl: './goal-chart.component.html',
  styleUrls: ['../goals.component.css', './goal-chart.component.css']
})
export class GoalChartComponent implements OnInit, OnChanges, OnDestroy {
    @Input() goal: Goal = {} as Goal;

    private profileSubscription: Subscription = null;
    public profile: Profile;

    public isLoading: boolean = false;
    public isChartError: boolean = false;

    private workouts: Workout[] = [];
    private weightData: ProfileWeight[] = [];
   
    public chartData: any[] = [
        {"name": "Ideal", "series":[] },
        {"name": "Target", "series":[] },
        {"name": "Progress", "series":[] },
     ];

    public chartColorScheme = { domain: ['#e1e7ed', 'rgb(244,67,54)', 'rgb(8,59,102)'] };
    public chartYMin: number = 0;
    public chartYMax: number = 1;
    public chartLabelY: string = "";

    // TODO: Get workouts or weight data relevant for chart. Use that data to get more points in chart.

    constructor(private profileService: ProfileService, private workoutService: WorkoutService) {}

    ngOnInit() {
        this.profileSubscription = this.profileService.profile.subscribe((profileData: Profile) => { this.profile = profileData; });
        this._updateChart();
    }

    ngOnChanges() {
        if (this.profileSubscription) { // are we initialized?
             this._updateChart();
        }
    }

    ngOnDestroy() {
        if (this.profileSubscription) {
            this.profileSubscription.unsubscribe();
        }
    }

    private _updateChart() {

        if (this.goal && this.goal.id) {

            // set Y axis name
            if (this.goal.categoryUnit != "#") {
                this.chartLabelY = this.goal.categoryUnit;
            }
            else {
                this.chartLabelY = "Workouts";
            }

            // define goal target line and ideal progress line
            this._updateChartLimitLine();
            this._updateChartIdealLine();

            // get workout or weight data for this goal, and update 
            // chart display data when data is received
            if (this.goal.categoryName != "Weight loss") {
                this._getGoalWorkoutsAndUpdateChart();
            }
            else {
                this._getGoalWeightDataAndUpdateChart();              
            }
        }
        else {
            this.isChartError = true;
        }
    }

    private _getGoalWorkoutsAndUpdateChart() {
        this.isLoading = true;
        this.workoutService.getWorkoutsForGoal(this.profile.username, this.goal.id).pipe(take(1)).subscribe(
            (data: Workout[]) => {
                this.workouts = data;
                this._updateChartWorkoutLine();
                this.isLoading = false;
                this.isChartError = false;
            },
            err => {
                this.workouts = [];
                this.isLoading = false;
                this.isChartError = true;
            }
        );
    }

    private _getGoalWeightDataAndUpdateChart() {
        this.isLoading = true;
        const startDate = new Date(this.goal.startAt);
        const endDate = new Date(this.goal.endAt);
        const startDateStr = startDate.getFullYear() + '-' + (startDate.getMonth() + 1) + '-' + startDate.getDate();
        const endDateStr = endDate.getFullYear() + '-' + (endDate.getMonth() + 1) + '-' + endDate.getDate();

        this.profileService.getProfileWeightHistoryForInterval(this.profile.username, startDateStr, endDateStr).pipe(take(1)).subscribe(
            (data: ProfileWeight[]) => {
                this.weightData = data;
                this._updateChartWeightLine();
                this.isLoading = false;
                this.isChartError = false;
            },
            err => {
                this.weightData = [];
                this.isLoading = false;
                this.isChartError = true;
            }
        ) 
    }

    private _updateChartWorkoutLine()
    {
        const IDX = 2;
        var chartValue = 0;
        var lowestValue = 999999;
        var highestValue = 0;

        // Add initial point for start value
        this.chartData[IDX]["series"] = [{ "name": new Date(this.goal.startAt), "value": this.goal.startValue }];
        
        // Add data from workouts
        this.workouts.forEach(workout => {
            if (this.goal.categoryName == "Cumulative distance") {
                chartValue += (Math.round(workout.distance / 10) / 100);
            }
            else if (this.goal.categoryName == "Cumulative climb") {
                chartValue += workout.climb;
            }
            else if (this.goal.categoryName == "Workout count") {
                chartValue += 1;
            }
            else {
                // ignore
            }

            this.chartData[IDX]["series"].push({
                "name": new Date(workout.startAt),
                "value": chartValue
            });

            if (chartValue > highestValue) {
                highestValue = chartValue;
            }
            if (chartValue < lowestValue) {
                lowestValue = chartValue;
            }
        });

        // Add data for end date if finished
        const now = new Date();
        const goalEnd = new Date(this.goal.endAt);
        if (now >= goalEnd) {
            this.chartData[IDX]["series"].push({
                "name": goalEnd,
                "value": this.goal.currentValue
            });
        }

        this._updateChartYAxisRange(lowestValue, highestValue);
        this.chartData = [... this.chartData]; 
    }

    private _updateChartWeightLine()
    {
        const IDX = 2;
        var lowestValue = 999;
        var highestValue = 0;

        // Add initial point for start value
        this.chartData[IDX]["series"] = [{ "name": new Date(this.goal.startAt), "value": this.goal.startValue }];

        // Add data from weight entries
        this.weightData.slice().reverse().forEach(data => {
            this.chartData[IDX]["series"].push({
                "name": new Date(data.createdAt),
                "value": data.weight
            });

            if (data.weight > highestValue) {
                highestValue = data.weight;
            }
            if (data.weight < lowestValue) {
                lowestValue = data.weight;
            }
        });

        // Add data for end date if finished
        const now = new Date();
        const goalEnd = new Date(this.goal.endAt);
        if (now >= goalEnd) {
            this.chartData[IDX]["series"].push({
                "name": goalEnd,
                "value": this.goal.currentValue
            });
        }

        this._updateChartYAxisRange(lowestValue, highestValue);
        this.chartData = [... this.chartData];         
    }

    private _updateChartIdealLine() {
        const IDX = 0;
        this.chartData[IDX]["series"] = [];

        this.chartData[IDX]["series"].push({
            "name": new Date(this.goal.startAt),
            "value" : this.goal.startValue,
            });
        
        this.chartData[IDX]["series"].push({
            "name": new Date(this.goal.endAt),
            "value" : this.goal.targetValue,
            });
    }

    private _updateChartLimitLine() {
        const IDX = 1;
        this.chartData[IDX]["series"] = [];

        this.chartData[IDX]["series"].push({
            "name": new Date(this.goal.startAt),
            "value" : this.goal.targetValue,
            });
        
        this.chartData[IDX]["series"].push({
            "name": new Date(this.goal.endAt),
            "value" : this.goal.targetValue,
            });
    }

    private _updateChartYAxisRange(lowestProgressValue:number, highestProgressValue:number)
    {
        // Calculate y-axis max and min
        var lowestValue = Math.min(this.goal.startValue, this.goal.targetValue, this.goal.currentValue, lowestProgressValue);
        var highestValue = Math.max(this.goal.startValue, this.goal.targetValue, this.goal.currentValue, highestProgressValue);
        var chartMin = Math.floor(lowestValue / 10) * 10;
        var chartMax = 10 + (Math.floor(highestValue / 10) * 10);

        if (chartMin == lowestValue) {
            chartMin -= 5;
        }
        else if ((chartMin + 5) < lowestValue) {
            chartMin += 5;
        }
        
        if (chartMax == highestValue) {
            chartMax += 5;
        }
        else if ((chartMax - 5) > highestValue) {
            chartMax -= 5;
        }

        this.chartYMin = chartMin;
        this.chartYMax = chartMax;        
    }
}
