import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from './api.service';
import { User } from '../models';

@Injectable({ providedIn: 'root' })
export class UserService {

    constructor(private apiService: ApiService) {}

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
}
