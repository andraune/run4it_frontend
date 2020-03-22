import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { AuthenticationService } from '../services';

@Injectable({ providedIn: 'root' })
export class AuthenticatedGuard implements CanActivate {

    constructor(private router: Router, private authService: AuthenticationService) {}

    async canActivate() {
        await this.authService.waitForCompletedInit();
        const isAuthenticated = this.authService.isAuthenticated();

        if (isAuthenticated) {
            return true;
        }
        else {
            // TODO: Add returnUrl parameter
            console.log('AuthenticatedGuard: Not authed, redirecting to login');
            return this.router.parseUrl('/auth/login');
        }
    }
}
