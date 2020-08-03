import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, filter, first, distinctUntilChanged, catchError, finalize } from 'rxjs/operators';

import { ApiService } from './api.service';
import { JwtService } from './jwt.service';
import { User } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private REFRESH_TOKEN_EXPIRY_LIMIT_S = 86400; // 24 hrs
    private isPopulatedSubject: BehaviorSubject<boolean>;
    private authUserSubject: BehaviorSubject<User>;
    private isAuthenticatedSubject: BehaviorSubject<boolean>;
    public authenticatedUser$: Observable<User>;
    public isAuthenticated$: Observable<boolean>;

    constructor(private apiService: ApiService, private jwtService: JwtService) {
        this.isPopulatedSubject = new BehaviorSubject<boolean>(false);
        this.authUserSubject = new BehaviorSubject<User>({} as User);
        this.isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
        this.authenticatedUser$ = this.authUserSubject.asObservable().pipe(distinctUntilChanged());
        this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
    }

    getAuthUsername(): string {
        let retVal = "";
        const authUser = this.authUserSubject.value;

        if (authUser && (authUser.username != undefined) && (authUser.username != null)) {
            retVal = authUser.username;
        }
        return retVal;        
    }

    isAuthenticated(): boolean {
        return this.isAuthenticatedSubject.value;
    }

    login(emailStr: string, passwordStr: string): Observable<User> {
        return this.apiService.post('/users/login', { email: emailStr, password: passwordStr })
            .pipe(map(
                data => {
                    this._setAuthData(data);
                    return this.authUserSubject.value;
                }),
                catchError((error) => {
                    this._clearAuthData();
                    return throwError(error);
                })
            );
    }

    loginRefresh(): Observable<User> {
        return this.apiService.post('/users/loginRefresh')
            .pipe(map(
                data => {
                    this._setAuthData(data);
                    return this.authUserSubject.value;
                })
            );
    }

    logout() : Observable<boolean> {
        return this.apiService.delete('/users/logout')
            .pipe(map(
                data => {
                    this._clearAuthData();
                    return data;
                }),
                catchError((error) => {
                    this._clearAuthData();
                    return throwError(error);
                })
            );
    }

    logoutRefresh() : Observable<boolean> {
        return this.apiService.delete('/users/logoutRefresh')
            .pipe(map(
                data => {
                    this.jwtService.destroyRefreshToken();
                    return data;
                }),
                catchError((error) => {
                    this._clearAuthData();
                    return throwError(error);
                })
            );
    }

    _setAuthData(user: User) {
        if (user.accessToken) {
            this.jwtService.saveAccessToken(user.accessToken);
        }
        if (user.refreshToken) {
            this.jwtService.saveRefreshToken(user.refreshToken);
        }
        this.authUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
    }

    _clearAuthData() {
        this.jwtService.destroyAccessToken();
        this.jwtService.destroyRefreshToken();
        this.authUserSubject.next({} as User);
        this.isAuthenticatedSubject.next(false);
    }

    /* Call on app-load (in app.component's onInit) */
    populate() {
        if (this.jwtService.isTokenExpiring(this.jwtService.getRefreshToken(), this.REFRESH_TOKEN_EXPIRY_LIMIT_S)) {
            // Delete both now to enforce new log in at the start of the session
            this.jwtService.destroyAccessToken();
            this.jwtService.destroyRefreshToken();
        }       

        if (this.jwtService.getAccessToken() || this.jwtService.getRefreshToken()) {
            this.apiService.get("/user").pipe(
                finalize(() => this.isPopulatedSubject.next(true)),
            ).subscribe(
                data => this._setAuthData(data),
                err => this._clearAuthData()
            );
        } else {
            this._clearAuthData();
            console.log("Just about to emit isPopulatedSubject => true");
            this.isPopulatedSubject.next(true);
        }
    }

    /* Check in resolvers before checking isAuthed / getAuthUsername */
    waitForCompletedInit() : Promise<any> {
        return this.isPopulatedSubject.pipe(
            distinctUntilChanged(),
            filter(val => (val == true)),
            first()
        ).toPromise()
    }
}
