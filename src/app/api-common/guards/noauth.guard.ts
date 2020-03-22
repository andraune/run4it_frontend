import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { AuthenticationService } from '../services';

@Injectable({ providedIn: 'root' })
export class NotAuthenticatedGuard implements CanActivate {

    constructor(private router: Router, private authService: AuthenticationService) {}

    async canActivate() {  
        await this.authService.waitForCompletedInit();
        const isAuthenticated = this.authService.isAuthenticated();

        if (!isAuthenticated) {
            return true;
        }
        else {
            // TODO: Consider adding a notification
            console.log('NotAuthenticatedGuard: Already authed, redirecting to home');
            return this.router.parseUrl('/dashboard');
        }
    }
}
