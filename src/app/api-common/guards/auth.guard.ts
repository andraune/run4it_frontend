import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { take } from 'rxjs/operators';

import { UserService } from '../services';

@Injectable({ providedIn: 'root' })
export class AuthenticatedGuard implements CanActivate {

    constructor(private router: Router, private userService: UserService) {}

    async canActivate(activatedRoute: ActivatedRouteSnapshot, routerState: RouterStateSnapshot) {
        const isAuthenticated = await this.userService.getAuthenticated();

        if (isAuthenticated) {
            return true;
        }
        else {
            // TODO: Add returnUrl parameter
            console.log('AuthenticatedGuard: Not authed, redirecting to login');
            return this.router.parseUrl('/login');
        }
    }
}
