import { Component, OnInit, OnDestroy} from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, Event, NavigationEnd } from '@angular/router';
import { Workout, WorkoutService } from '../../api-common';


@Component({
  selector: 'app-workout-list',
  templateUrl: './workout-list.component.html',
  styleUrls: ['../workouts.component.css', './workout-list.component.css']
})
export class WorkoutListComponent implements OnInit, OnDestroy {

    public isCreateNewRoute: boolean = false;
     
    private subscriptions: Subscription[] = []

    public workoutCount: number = 0;
    public workoutListCurrentMonth: Workout[] = [];
    public workoutListPreviousMonth: Workout[] = [];
    public workoutListYearOffset0: Workout[] = [];
    public workoutListYearOffset1: Workout[] = [];
    public workoutListYearOffset2: Workout[] = [];
    public workoutListYearOffset3: Workout[] = [];
    public workoutListYearOffset4: Workout[] = []; // all the rest

    constructor(private router: Router, private workoutService: WorkoutService)
    {}

    ngOnInit() {
        this.subscriptions.push(this.router.events.subscribe(
                (event: Event) => {
                    if (event instanceof NavigationEnd) {
                        this.isCreateNewRoute = (event.url == "/workouts/new");
                    }
                }
            )
        );

        this.subscriptions.push(this.workoutService.workoutList.subscribe(
                (workoutData: Workout[]) => { this._groupWorkouts(workoutData); }
            )
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    private _groupWorkouts(workoutList:Workout[]) {
        this.workoutCount = workoutList.length;
        var datetimeNow = new Date();
        var idx: number = 0;

        // Current month
        var datetimeLimit = new Date(datetimeNow.getFullYear(), datetimeNow.getMonth(), 1);
        this.workoutListCurrentMonth = [];

        for (; idx < this.workoutCount; ++idx) {
            var workoutDate = new Date(workoutList[idx].startAt);

            if (workoutDate > datetimeLimit) {
                this.workoutListCurrentMonth.push(workoutList[idx]);
            }
            else {
                break;
            }
        }

        // Previous month
        var datetimeLimit = new Date(datetimeNow.getFullYear(), datetimeNow.getMonth() - 1, 1);
        this.workoutListPreviousMonth = [];

        for (; idx < this.workoutCount; ++idx) {
            var workoutDate = new Date(workoutList[idx].startAt);

            if (workoutDate > datetimeLimit) {
                this.workoutListPreviousMonth.push(workoutList[idx]);
            }
            else {
                break;
            }
        }

        // Remaining workouts this year, if any
        var datetimeLimit = new Date(datetimeNow.getFullYear(), 0, 1);
        this.workoutListYearOffset0 = [];

        for (; idx < this.workoutCount; ++idx) {
            var workoutDate = new Date(workoutList[idx].startAt);

            if (workoutDate > datetimeLimit) {
                this.workoutListYearOffset0.push(workoutList[idx]);
            }
            else {
                break;
            }
        }

        // Workouts previous year
        var datetimeLimit = new Date(datetimeNow.getFullYear() - 1, 0, 1);
        this.workoutListYearOffset1 = [];

        for (; idx < this.workoutCount; ++idx) {
            var workoutDate = new Date(workoutList[idx].startAt);

            if (workoutDate > datetimeLimit) {
                this.workoutListYearOffset1.push(workoutList[idx]);
            }
            else {
                break;
            }
        }

        // Workouts year before previous
        var datetimeLimit = new Date(datetimeNow.getFullYear() - 2, 0, 1);
        this.workoutListYearOffset2 = [];

        for (; idx < this.workoutCount; ++idx) {
            var workoutDate = new Date(workoutList[idx].startAt);

            if (workoutDate > datetimeLimit) {
                this.workoutListYearOffset2.push(workoutList[idx]);
            }
            else {
                break;
            }
        }

        // Workouts your before that again
        var datetimeLimit = new Date(datetimeNow.getFullYear() - 3, 0, 1);
        this.workoutListYearOffset3 = [];

        for (; idx < this.workoutCount; ++idx) {
            var workoutDate = new Date(workoutList[idx].startAt);

            if (workoutDate > datetimeLimit) {
                this.workoutListYearOffset3.push(workoutList[idx]);
            }
            else {
                break;
            }
        }

        // Workouts your before that again
        this.workoutListYearOffset4 = [];

        for (; idx < this.workoutCount; ++idx) {
            this.workoutListYearOffset4.push(workoutList[idx])
        }
    }

}
