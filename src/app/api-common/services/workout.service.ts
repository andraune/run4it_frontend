import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { ApiService } from './api.service';
import { Workout, WorkoutCategory } from '../models';


@Injectable({ providedIn: 'root' })
export class WorkoutService {

    constructor(private apiService: ApiService) {}

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
            map((data : Workout[]) => {
                    return data;
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
}
