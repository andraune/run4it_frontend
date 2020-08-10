import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { first, map, catchError } from 'rxjs/operators';

import { ApiService } from './api.service';
import { Workout, WorkoutCategory } from '../models';


@Injectable({ providedIn: 'root' })
export class WorkoutService {

    private workoutListSubject: BehaviorSubject<Workout[]>;
    public workoutList: Observable<Workout[]>; 

    constructor(private apiService: ApiService) {
        this.workoutListSubject = new BehaviorSubject<Workout[]>([] as Workout[]);
        this.workoutList = this.workoutListSubject.asObservable();
    }


    getWorkouts(username: string, limit:number = 0, offset:number = 0) {

        var url: string = `/profiles/${username}/workouts`;

        if ((limit > 0) && (offset > 0)) {
            url += `?limit=${limit}&offset=${offset}`;
        }
        else if (limit > 0) {
            url += `?limit=${limit}`;
        }
        else {
            // if none are > 0, or only offset > 0, we do not add query string params
        }

        return this.apiService.get(url).pipe(
            map(
                (data : Workout[]) => {
                    this.workoutListSubject.next(data);    
                    return this.workoutListSubject.value;
                }
            ),
            catchError(
                error => {
                    this.workoutListSubject.next([] as Workout[]);
                    return throwError(error);
                }
            )
        );        
    }


    getWorkoutsForGoal(username: string, goalID:number) {
        return this.apiService.get(`/profiles/${username}/workouts?goalID=${goalID}`).pipe(
            map((data : Workout[]) => {
                    return data;
                }
            )
        );        
    }

    getWorkoutCategories() {
        return this.apiService.get('/workout_categories').pipe(
            map((data : WorkoutCategory[]) => {
                console.log("Workout category information retrieved.");
                    return data;
                }
            )
        );
    }

    getWorkoutByID(username: string, id: number) {
        return this.apiService.get(`/profiles/${username}/workouts/${id}`).pipe(
            map((data : Workout) => {
                    return data;
                }
            )
        );        
    }

    createWorkoutByUpload(username: string, categoryID:number, fileToUpload:File) {
        const uploadUrl: string = `/profiles/${username}/workouts/gpx/${categoryID}`;
        const formData: FormData = new FormData();
        formData.append("gpxfile", fileToUpload, fileToUpload.name);

        return this.apiService.postUpload(uploadUrl, formData).pipe(
            map((data: Workout) => {
                    console.log("Workout created");
                    this.getWorkouts(username, 20).pipe(first()).subscribe();
                    return data;
                }
            )
        );
    }
}
