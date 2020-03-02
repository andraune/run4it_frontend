import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, throwError } from 'rxjs';
import { map, filter, first, distinctUntilChanged, catchError } from 'rxjs/operators';

import { ApiService } from './api.service';
import { JwtService } from './jwt.service';
import { User } from '../models';

@Injectable({ providedIn: 'root' })
export class UserService {
    private REFRESH_TOKEN_EXPIRY_LIMIT_S = 86400; // 24 hrs
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    private isAuthenticatedSubject: ReplaySubject<boolean>;
    public isAuthenticatedObservable: Observable<boolean>;

    constructor(private apiService: ApiService, private jwtService: JwtService) {
        this.currentUserSubject = new BehaviorSubject<User>({} as User);
        this.currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());
        this.isAuthenticatedSubject = new ReplaySubject<boolean>(1);
        this.isAuthenticatedObservable = this.isAuthenticatedSubject.asObservable();
    }

    /* Call on app-load (in app.component's onInit) */
    populate() {
        if (this.jwtService.isTokenExpiring(this.jwtService.getRefreshToken(), this.REFRESH_TOKEN_EXPIRY_LIMIT_S)) {
            // Delete both now to enforce new log in at the start of the session
            console.log("Deleting expiring refresh token on appInit");
            this.jwtService.destroyAccessToken();
            this.jwtService.destroyRefreshToken();
        }       

        if (this.jwtService.getAccessToken() || this.jwtService.getRefreshToken()) {
            this.apiService.get("/user").subscribe(
                data => this.setAuthData(data),
                err => this.clearAuthData()
            );
        } else {
            this.clearAuthData();
        }
    }

    getUsername(): string {
        let retVal = "";
        const currentUser = this.currentUserSubject.value;

        if (currentUser.username != undefined && currentUser.username != null) {
            retVal = currentUser.username;
        }
        return retVal;
    }

    isAuthenticated(): Promise<boolean> {
        return this.isAuthenticatedSubject.pipe(
            filter(val => (val !== null && val != undefined)),
            first()
        ).toPromise();
    }

    login(emailStr: string, passwordStr: string): Observable<User> {
        return this.apiService.post('/users/login', { email: emailStr, password: passwordStr })
            .pipe(map(
                data => {
                    console.log("setting auth data after login");
                    this.setAuthData(data);
                    return this.currentUserSubject.value;
                }),
                catchError((error) => {
                    console.log("clearing auth data after failed login");
                    this.clearAuthData();
                    return throwError(error);
                })
            );
    }

    loginRefresh(): Observable<User> {
        return this.apiService.post('/users/loginRefresh')
            .pipe(map(
                data => {
                    console.log(`setting auth data after loginRefresh`);
                    this.setAuthData(data);
                    return this.currentUserSubject.value;
                })
            );
    }

    logout() : Observable<boolean> {
        return this.apiService.delete('/users/logout')
            .pipe(map(
                data => {
                    console.log(`clearing auth data after logout`);
                    this.clearAuthData();
                    return data;
                }),
                catchError((error) => {
                    console.log("clearing auth data after failed logout");
                    this.clearAuthData();
                    return throwError(error);
                })
            );
    }

    logoutRefresh() : Observable<boolean> {
        return this.apiService.delete('/users/logoutRefresh')
            .pipe(map(
                data => {
                    console.log(`clearing refreshToken after logoutRefresh`);
                    this.jwtService.destroyRefreshToken();
                    return data;
                }),
                catchError((error) => {
                    console.log("clearing refreshToken data after failed logoutRefresh");
                    this.clearAuthData();
                    return throwError(error);
                })
            );
    }

    register(usernameStr: string, emailStr: string, passwordStr: string): Observable<User> {
        return this.apiService.post('/users', { username: usernameStr, email: emailStr, password: passwordStr })
            .pipe(map(
                data => {
                    return data;
                })
            );
    }

    confirm(usernameStr: string, confirmationCodeStr: string): Observable<User> {
        return this.apiService.post('/users/confirmation', { username: usernameStr, confirmationCode: confirmationCodeStr })
            .pipe(map(
                data => {
                    return data;
                })
            );
    }

    setAuthData(user: User) {
        if (user.accessToken) {
            this.jwtService.saveAccessToken(user.accessToken);
        }
        if (user.refreshToken) {
            this.jwtService.saveRefreshToken(user.refreshToken);
        }
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
    }

    clearAuthData() {
        this.jwtService.destroyAccessToken();
        this.jwtService.destroyRefreshToken();
        this.currentUserSubject.next({} as User);
        this.isAuthenticatedSubject.next(false);
    }
}
