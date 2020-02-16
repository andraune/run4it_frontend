import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { UserService } from '../services';

@Injectable({ providedIn: 'root' })
export class NotAuthenticatedGuard implements CanActivate {

    constructor(private router: Router, private userService: UserService) {}

    async canActivate(activatedRoute: ActivatedRouteSnapshot, routerState: RouterStateSnapshot) {  
        const isAuthenticated = await this.userService.isAuthenticated();

        if (!isAuthenticated) {
            return true;
        }
        else {
            // TODO: Consider adding a notification
            console.log('NotAuthenticatedGuard: Already authed, redirecting to home');
            return this.router.parseUrl('/home');
        }
    }
}
