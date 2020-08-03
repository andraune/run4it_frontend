import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { Goal } from '../../api-common';


@Component({
  selector: 'app-goal-chart',
  templateUrl: './goal-chart.component.html',
  styleUrls: ['../goals.component.css', './goal-chart.component.css']
})
export class GoalChartComponent implements OnInit, OnChanges {
    @Input() goal: Goal = {} as Goal;

    public chartType: string = ""; // valid is 'line-chart', more might be added
    
    public chartData: any[] = [
        {"name": "Ideal", "series":[] },
        {"name": "Target", "series":[] },
        {"name": "Progress", "series":[] }
     ];

    public chartColorScheme = { domain: ['#e1e7ed', 'rgb(244,67,54)', 'rgb(8,59,102)'] };
    public chartYMin: number = 0;
    public chartYMax: number = 1;
    public chartLabelY: string = "";

    // TODO: Get workouts or weight data relevant for chart. Use that data to get more points in chart.

    constructor() {}

    ngOnInit() {}

    ngOnChanges() {
        if (this.goal) {
            this._updateChart();
        }
        else {
            this.chartType = "";
        }
    }

    private _updateChart() {

        if (this.goal.id) {
            this._updateChartLimitLine();
            this._updateChartIdealLine();
            this._updateChartData();
            this.chartData = [... this.chartData];

            if (this.goal.categoryUnit != "#") {
                this.chartLabelY = this.goal.categoryUnit;
            }
            else {
                this.chartLabelY = "Workouts";
            }

            this.chartType = "line-chart";
        }
        else {
            this.chartType = "";
        }
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

    private _updateChartData() {
        const IDX = 2;
        this.chartData[IDX]["series"] = [];

        var currentDate = new Date();
        var startDate = new Date(this.goal.startAt);
        var endDate = new Date(this.goal.endAt);

        if (currentDate > startDate) { // i.e. goal period has started
            this.chartData[IDX]["series"].push({
                "name": startDate,
                "value" : this.goal.startValue,
                });
            
            if (currentDate > endDate) { // i.e. goal period has ended
                this.chartData[IDX]["series"].push({
                    "name": endDate,
                    "value" : this.goal.currentValue,
                });
            }
            else {
                this.chartData[IDX]["series"].push({
                    "name": currentDate,
                    "value" : this.goal.currentValue,
                });
            }          
        }

        // Calculate y-axis max and min
        var lowestValue = Math.min(this.goal.startValue, this.goal.targetValue, this.goal.currentValue);
        var highestValue = Math.max(this.goal.startValue, this.goal.targetValue, this.goal.currentValue);
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
