import { Injectable, } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';

import { NotificationService, AuthenticationService, Profile, ProfileService } from '../api-common';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ProfileResolver implements Resolve<Profile> {
  constructor(
    private notificationService: NotificationService,
    private authService: AuthenticationService,
    private profileService: ProfileService,
    private router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<any> {

    const authUser = this.authService.getAuthUsername();

    if (authUser != "") {
      return this.profileService.getProfile(authUser)
        .pipe(
          catchError((err) => {
            this.notificationService.addError(0, 'resolve', 'Failed to resolve profile.', true);
            this.router.navigate(['/']);
            return throwError(err);
          })
        );
    } else {
      this.notificationService.addError(0, 'resolve', 'Failed to resolve profile due to invalid username.', true);
      this.router.navigate(['/']);
      return throwError('Unknown resolve error');    
    }
  }
}
