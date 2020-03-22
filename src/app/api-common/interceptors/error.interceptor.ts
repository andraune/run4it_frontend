import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap, finalize } from 'rxjs/operators';

import { JwtService, AuthenticationService, NotificationService } from '../services';
import { User } from '../models';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    private refreshTokenInProgress = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(
        private jwtService: JwtService, 
        private authService: AuthenticationService,
        private notificationService: NotificationService
    ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError(err => {
                const errorCode = err.status;
                console.log(`Request ${request.url} error code ${errorCode}`);

                if (this.shouldTryTokenRefresh(errorCode, request.url)) {
                    if (this.refreshTokenInProgress) {
                        console.log(`refresh-token already in progress, wait for it to complete, then retry request ${request.url}`);
                        // already in progress, so wait for it to complete before
                        // issuing our original request again
                        return this.refreshTokenSubject.pipe(
                            filter(result => result !== null),
                            take(1),
                            switchMap(
                                () => {
                                    console.log(`done waiting for token refresh, retry ${request.url}`);
                                    return next.handle(request);
                                }
                            )
                        );
                    }
                    else {
                        console.log(`attempting refresh-token after 401 error on request ${request.url}`);
                        this.refreshTokenInProgress = true;
                        this.refreshTokenSubject.next(null);

                        return this.authService.loginRefresh().pipe(
                            switchMap(
                                (user: User) => {
                                    this.refreshTokenSubject.next(user ? true : false);
                                    return next.handle(request);
                                }
                            ),
                            finalize(() => this.refreshTokenInProgress = false)
                        );
                    }
                }
                else {
                    return throwError(this.collectErrorStrings(err));  
                }
            })
        );
    }

    shouldTryTokenRefresh(errorCode: number, url: string): boolean {
        var shouldRefresh = false;

        if (errorCode === 401) { // Not authorized
            const isRefreshRequest = url.match(/\/users\/loginRefresh$/);
            const isAccessTokenExpired = this.jwtService.isTokenExpired(this.jwtService.getAccessToken());

            if (isRefreshRequest) {
                shouldRefresh = false;
            }
            else if (isAccessTokenExpired) {
                shouldRefresh = this.jwtService.getRefreshToken() ? true : false;
            }
        }

        return shouldRefresh;
    }

    collectErrorStrings(error: HttpErrorResponse) : string[] {
        var errors = [];

        if (error.error.msg) {
            errors.push(error.error.msg);
            this.notificationService.addError(error.status, '', error.error.msg);
        }

        if (error.error.errors && Object.keys(error.error.errors)) {
            for (var errorKey in error.error.errors) {
               
                for (var idx in error.error.errors[errorKey]) {
                    errors.push(error.error.errors[errorKey][idx]); 
                    this.notificationService.addError(error.status, errorKey, error.error.errors[errorKey][idx]);
                }       
            }
        }

        if (errors.length == 0) {
            errors.push(error.statusText);
            this.notificationService.addError(error.status, '', error.statusText);
        }

        return errors;
    }
}
