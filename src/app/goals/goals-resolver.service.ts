import { Injectable, } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { NotificationService, AuthenticationService, Goal, GoalCategory, GoalService } from '../api-common';

@Injectable({ providedIn: 'root' })
export class ActiveGoalsResolver implements Resolve<Goal[]> {
  constructor(
    private notificationService: NotificationService,
    private authService: AuthenticationService,
    private goalService: GoalService,
  ) {}

  resolve(): Observable<any> {
    const authUser = this.authService.getAuthUsername();

    if (authUser != "") {
      return this.goalService.getActiveGoals(authUser).pipe(
        catchError((err) => {
          this.notificationService.addError(0, 'resolve', 'Failed to preload active goals.', false);
          return throwError(err);
        }));
    }
  }
}

@Injectable({ providedIn: 'root' })
export class FutureGoalsResolver implements Resolve<Goal[]> {
  constructor(
    private notificationService: NotificationService,
    private authService: AuthenticationService,
    private goalService: GoalService,
  ) {}

  resolve(): Observable<any> {
    const authUser = this.authService.getAuthUsername();

    if (authUser != "") {
      return this.goalService.getFutureGoals(authUser).pipe(
        catchError((err) => {
          this.notificationService.addError(0, 'resolve', 'Failed to preload future goals.', false);
          return throwError(err);
        }));
    }
  }
}

@Injectable({ providedIn: 'root' })
export class ExpiredGoalsResolver implements Resolve<Goal[]> {
  constructor(
    private notificationService: NotificationService,
    private authService: AuthenticationService,
    private goalService: GoalService,
  ) {}

  resolve(): Observable<any> {
    const authUser = this.authService.getAuthUsername();

    if (authUser != "") {
      return this.goalService.getExpiredGoals(authUser).pipe(
        catchError((err) => {
          this.notificationService.addError(0, 'resolve', 'Failed to preload expired goals.', false);
          return throwError(err);
        }));
    }
  }
}

@Injectable({ providedIn: 'root' })
export class GoalCategoriesResolver implements Resolve<GoalCategory[]> {
  constructor(
    private notificationService: NotificationService,
    private goalService: GoalService,
  ) {}

  resolve(): Observable<any> {

      return this.goalService.getGoalCategories().pipe(
        catchError((err) => {
          this.notificationService.addError(0, 'resolve', 'Failed to preload goal categories.', false);
          return throwError(err);
        }));
  }
}
