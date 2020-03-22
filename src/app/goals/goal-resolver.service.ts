import { Injectable, } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { NotificationService, AuthenticationService, GoalInterface, GoalService } from '../api-common';


@Injectable({ providedIn: 'root' })
export class GoalResolver implements Resolve<GoalInterface[]> {
  constructor(
    private notificationService: NotificationService,
    private authService: AuthenticationService,
    private goalService: GoalService,
  ) {}

  resolve(
  ): Observable<any> {

    const authUser = this.authService.getAuthUsername();

    if (authUser != "") {
      return this.goalService.getActiveGoals(authUser)
        .pipe(
          catchError((err) => {
            this.notificationService.addError(0, 'resolve', 'Failed to preload goals.', false);
            return throwError(err);
          })
        );
    }
    else {
      this.notificationService.addError(0, 'resolve', 'Failed to preload goals due to invalid username.');
    }
  }
}
