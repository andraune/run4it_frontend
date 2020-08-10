import { Injectable, } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { NotificationService, AuthenticationService, Workout, WorkoutService } from '../api-common';

@Injectable({ providedIn: 'root' })
export class WorkoutListResolver implements Resolve<Workout[]> {
  constructor(
    private notificationService: NotificationService,
    private authService: AuthenticationService,
    private workoutService: WorkoutService,
  ) {}

  resolve(): Observable<any> {
    const authUser = this.authService.getAuthUsername();

    if (authUser != "") {
      return this.workoutService.getWorkouts(authUser, 20, 0).pipe(
        catchError((err) => {
          this.notificationService.addError(0, 'resolve', 'Failed to preload workouts.', false);
          return throwError(err);
        }));
    }
  }
}
