import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

import { ApiService } from './api.service';
import { JwtService } from './jwt.service';
import { User } from '../models';

@Injectable({ providedIn: 'root' })
export class UserService {
    private REFRESH_TOKEN_EXPIRY_LIMIT_S = 86400; // 24 hrs
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    private isAuthenticatedSubject: ReplaySubject<boolean>;
    public isAuthenticated: Observable<boolean>;

    constructor(private apiService: ApiService, private jwtService: JwtService) {
        this.currentUserSubject = new BehaviorSubject<User>({} as User);
        this.currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());
        this.isAuthenticatedSubject = new ReplaySubject<boolean>(1);
        this.isAuthenticated = this.isAuthenticatedSubject.asObservable();
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

    login(emailStr: string, passwordStr: string): Observable<User> {
        return this.apiService.post('/users/login', { email: emailStr, password: passwordStr })
            .pipe(map(
                data => {
                    console.log(`setting auth data after login`);
                    this.setAuthData(data);
                    return this.currentUserSubject.value;
                }
            ));
    }

    loginRefresh(): Observable<User> {
        return this.apiService.post('/users/loginRefresh')
        .pipe(map(
            data => {
                console.log(`setting auth data after loginRefresh`);
                this.setAuthData(data);
                return this.currentUserSubject.value;
            }
        ));
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
