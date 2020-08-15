import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Profile, Workout, NotificationService, ProfileService, WorkoutService } from '../../api-common';
import { WorkoutCategoryIconPipe, WorkoutDurationStringPipe, WorkoutTimeOfDayStringPipe } from '../workouts.pipe';

@Component({
  selector: 'app-workout-view',
  templateUrl: './workout-view.component.html',
  styleUrls: ['../workouts.component.css', './workout-view.component.css']
})
export class WorkoutViewComponent implements OnInit, OnChanges, OnDestroy {
    
    private subscriptions: Subscription[] = [];  
    private profileSubscription: Subscription = null;
    
    public paramID: number = 0;
    public profile: Profile = {} as Profile;
    
    public isLoadingWorkout: boolean = false;
    public workout: Workout = null;
    public workoutList: Workout[] = [];
    public workoutGeneralCards: any[] = [];
    public workoutSpecificCards: any[] = [];


    constructor(
        private route: ActivatedRoute,
        private notificationService: NotificationService,
        private profileService: ProfileService,
        private workoutService: WorkoutService,
        private categoryIconPipe: WorkoutCategoryIconPipe,
        private durationStringPipe: WorkoutDurationStringPipe,
        private timeOfDayStringPipe: WorkoutTimeOfDayStringPipe)
    {}
  
    ngOnInit() {
        this.profileSubscription = this.profileService.profile.subscribe((profileData: Profile) => { this.profile = profileData; });

        this.subscriptions.push(
            this.route.params.subscribe(params => {
                var idAsNumber = +params['id'];
      
                if (isNaN(idAsNumber) || (idAsNumber == 0)) {
                    this.paramID = 0;
                }
                else {
                    this.paramID = idAsNumber;
                    this._getWorkout();
                }
            })
        );

        this.subscriptions.push(
            this.workoutService.workoutList.subscribe((workoutData: Workout[]) => {
                this.workoutList = workoutData;

                if ((this.workoutList.length > 0) && (this.paramID == 0)) {
                    this.paramID = this.workoutList[0].id;
                    this._getWorkout();
                }
            })
        );
    }

    ngOnChanges() {
        if (this.profileSubscription) { // are we initialized?
            if (this.paramID > 0) {
                this._getWorkout();
            }
        }
    }

    ngOnDestroy(){
        if (this.profileSubscription) {
            this.profileSubscription.unsubscribe();
        }

        this.subscriptions.forEach(subscription => { subscription.unsubscribe() });
    }


    private _getWorkout() {
        this.isLoadingWorkout = true;

        this.workoutService.getWorkoutByID(this.profile.username, this.paramID).pipe(take(1)).subscribe(
            (data: Workout) => {
                this.workout = data;
                this._createGeneralWorkoutCards();
                this._createSpecificWorkoutCards();
                this.isLoadingWorkout = false;
            },
            err => {
                this.workout = null;
                this.isLoadingWorkout = false;
                this.notificationService.addError(0, '', `Failed to get workout data for ID=${this.paramID}.`);
            }
        );
    }

    private _createGeneralWorkoutCards() {
        this.workoutGeneralCards = [];

        // Type of workout and date
        const startDate = new Date(this.workout.startAt);     
        this.workoutGeneralCards.push(this._generateCard(
           this.timeOfDayStringPipe.transform(this.workout) + " workout",
           this.workout.categoryName,
           this.categoryIconPipe.transform(this.workout),
           new Intl.DateTimeFormat("en-GB", { year: 'numeric', month: 'short', day: 'numeric' }).format(startDate)
        ));

        // Workout duration
        this.workoutGeneralCards.push(this._generateCard("Duration", "Workout time", "schedule", this.durationStringPipe.transform(this.workout)));

        // Heart rate
        var heartRate = 0;

        if (this.workout.trackSummary && this.workout.trackSummary.heartBpm > 0) {
            heartRate = Math.round(this.workout.trackSummary.heartBpm);
        } 

        this.workoutGeneralCards.push(this._generateCard("Heart rate", "bpm", "favorite", heartRate > 0 ? heartRate.toString() : "-"));

        // Calories burned
        var birthdate = null;
        if (this.profile.birthDate) {
            birthdate = new Date(birthdate);
        }
        const kCals = this._calcCalories(this.workout, this.profile.weight, this.profile.weight, birthdate, heartRate);

        this.workoutGeneralCards.push(this._generateCard("Calories burned", "kCal", "local_fire_department", kCals > 0 ? kCals.toString() : "-"));
    }

    private _createSpecificWorkoutCards() {
        this.workoutSpecificCards = [];

        if (this.workout.categoryName != "Fitness"){

            // distance
            this.workoutSpecificCards.push(this._generateCard("Distance", "km", "straighten", this.workout.distance ? (this.workout.distance/1000).toFixed(2) : "-"));

            // average pace or speed
            if (this.workout.categoryName == "Running") {
                this.workoutSpecificCards.push(this._generateCard("Average pace", "min/km", "speed", this.workout.averagePace ? this.workout.averagePace : "-"));
            }
            else {
                this.workoutSpecificCards.push(this._generateCard("Average speed", "km/h", "speed", this.workout.averageSpeed > 0 ? this.workout.averageSpeed.toFixed(2) : "-"));
            }

            // climb
            this.workoutSpecificCards.push(this._generateCard("Total climb", "m", "terrain", this.workout.climb ? this.workout.climb.toFixed(0) : "-"));

            // TBD
            this.workoutSpecificCards.push(this._generateCard("TBD", "Cadence/Split", "help", "-"));

        }
    }

    private _generateCard(title:string, subtitle:string, icon:string, content:string) {
        return { title: title, subtitle: subtitle, icon: icon, content: content };
    }

    private _calcCalories(workout:Workout, weight: number, height: number, birthdate: Date, heartRate: number): number {
        // based on https://sites.google.com/site/compendiumofphysicalactivities/Activity-Categories

        var kCalories:number = 0;
        
        if (workout.duration > 0 && weight > 0) {
            var activity_met: number = 0;
            var avgSpeed = workout.averageSpeed; // km pr hour

            // Find MET
            switch (workout.categoryName) {
                case "Fitness":
                    if (heartRate < 120) activity_met = 5.0; //02061
                    else activity_met = 5.5; // 02060
                    break;
                case "Cross-country skiing":
                    if (avgSpeed < 4) activity_met = 6.8; // 19080
                    else if (avgSpeed < 7.8) activity_met = 9.0; // 19090
                    else if (avgSpeed < 12.6) activity_met = 12.5; // 19100
                    else activity_met = 15.0; // 19110
                    break;
                case "Hiking": // 17080
                    if (heartRate < 120) activity_met = 6.0 // 17080
                    else activity_met = 7.8; // 17012
                    break;
                case "Roller skiing": // 19175-ish, combined with CCS above
                    if (avgSpeed < 4) activity_met = 5.6;
                    else if (avgSpeed < 7.8) activity_met = 7.5;
                    else if (avgSpeed < 12.6) activity_met = 10.4;
                    else activity_met = 12.5;
                    break;
                case "Running":
                    if (avgSpeed < 8.0) activity_met = 8.3; //  12030
                    else if (avgSpeed < 9.6) activity_met = 9.8; // 12050
                    else if (avgSpeed < 10.7) activity_met = 10.5; // 12060
                    else if (avgSpeed < 11.2) activity_met = 11.0; // 12070
                    else if (avgSpeed < 12.0) activity_met = 11.8; // 12080
                    else if (avgSpeed < 12.8) activity_met = 11.8; // 12090
                    else if (avgSpeed < 13.8) activity_met = 12.3; // 12100
                    else if (avgSpeed < 14.4) activity_met = 12.8; // 12110
                    else if (avgSpeed < 16) activity_met = 14.5; // 12120
                    else if (avgSpeed < 17.6) activity_met = 16.0; // 12130
                    else activity_met = 19; // 12132
                    break;
                default:
                    break;
            }

            // Corrected MET - https://sites.google.com/site/compendiumofphysicalactivities/corrected-mets
            // as we don't have gender yet, use male
            // male = 66.473 + 5.003*height(cm) + 13.752*weight(kg) - 6.755*age(years)
            // female = 655.096 + 1.850*height(cm) + 9.563*weight(kg) - 4.6756*age(years)
            if ((height > 0) && birthdate) {
                const years = birthdate.getFullYear() - new Date().getFullYear();
                const kCalPerDay = 66.473 + 5.003*height + 13.752*weight - 6.755*years;
                const rmr = kCalPerDay / 1440 / 5 / weight * 1000;
                activity_met = activity_met * 3.5 / rmr;
            }
            
            if (workout.duration > 0) {
                const workout_hours = workout.duration / 3600.0;
                kCalories = Math.round(activity_met * weight * workout_hours);
            }
        }

        return kCalories;
    }
}
