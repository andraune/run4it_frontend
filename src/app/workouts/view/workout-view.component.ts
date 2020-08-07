import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Profile, Workout, NotificationService, ProfileService, WorkoutService } from '../../api-common';

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


    constructor(
        private route: ActivatedRoute,
        private notificationService: NotificationService,
        private profileService: ProfileService,
        private workoutService: WorkoutService)
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
                this.isLoadingWorkout = false;
            },
            err => {
                this.workout = null;
                this.isLoadingWorkout = false;
                this.notificationService.addError(0, '', `Failed to get workout data for ID=${this.paramID}.`);
            }
        );
    }
}
