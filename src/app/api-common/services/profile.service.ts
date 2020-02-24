import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, distinctUntilChanged, catchError } from 'rxjs/operators';

import { ApiService } from './api.service';
import { Profile } from '../models';

@Injectable({ providedIn: 'root' })
export class ProfileService {
    private profileSubject: BehaviorSubject<Profile>;
    public profile: Observable<Profile>; 

    constructor(private apiService: ApiService) {
        this.profileSubject = new BehaviorSubject<Profile>({} as Profile);
        this.profile = this.profileSubject.asObservable().pipe(distinctUntilChanged());
    }

    getProfile(username: string): Observable<Profile> {
        return this.apiService.get(`/profiles/${username}`).pipe(
            map(
                data => {
                    console.log("received profile data");
                    this.profileSubject.next(data);
                    return this.profileSubject.value;
                }
            ),
            catchError(
                error => {
                    console.log("failed to get profile");
                    this.profileSubject.next({} as Profile);
                    return throwError(error);
                }
            )
        );
    }

    updateProfileUserInfo(username: string, birthDate:string, height:number, weight:number) {  
        return this.apiService.put(`/profiles/${username}`, { birthDate: birthDate, height: height, weight: weight})
            .pipe(
                map(
                    (data: Profile) => {
                        console.log("Profile user information updated.");
                        this.profileSubject.next(data);
                        return this.profileSubject.value;
                    }
                )
            );
    }

    updateProfileWeight(username: string, weight: number) {
        return this.apiService.put(`/profiles/${username}`, { weight: weight})
            .pipe(
                map(
                    (data: Profile) => {
                        console.log("Profile weight updated.");
                        this.profileSubject.next(data);
                        return this.profileSubject.value;
                    }
                )
            );
    }
}
