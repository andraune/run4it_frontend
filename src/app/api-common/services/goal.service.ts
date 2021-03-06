import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { first, map, catchError } from 'rxjs/operators';

import { ApiService } from './api.service';
import { Goal, GoalCategory } from '../models';

@Injectable({ providedIn: 'root' })
export class GoalService {
    private activeGoalsSubject: BehaviorSubject<Goal[]>;
    public activeGoals: Observable<Goal[]>;  
    private futureGoalsSubject: BehaviorSubject<Goal[]>;
    public futureGoals: Observable<Goal[]>;
    private expiredGoalsSubject: BehaviorSubject<Goal[]>;
    public expiredGoals: Observable<Goal[]>;

    constructor(private apiService: ApiService) {
        this.activeGoalsSubject = new BehaviorSubject<Goal[]>([] as Goal[]);
        this.activeGoals = this.activeGoalsSubject.asObservable();
        this.futureGoalsSubject = new BehaviorSubject<Goal[]>([] as Goal[]);
        this.futureGoals = this.futureGoalsSubject.asObservable();
        this.expiredGoalsSubject = new BehaviorSubject<Goal[]>([] as Goal[]);
        this.expiredGoals = this.expiredGoalsSubject.asObservable();
    }

    getActiveGoals(username: string): Observable<Goal[]> {
        return this.apiService.get(`/profiles/${username}/goals?filter=active`).pipe(
            map(
                data => {
                    this.activeGoalsSubject.next(data);
                    return this.activeGoalsSubject.value;
                }
            ),
            catchError(
                error => {
                    this.activeGoalsSubject.next([] as Goal[]);
                    return throwError(error);
                }
            )
        );
    }

    getFutureGoals(username: string): Observable<Goal[]> {
        return this.apiService.get(`/profiles/${username}/goals?filter=future`).pipe(
            map(
                data => {
                    this.futureGoalsSubject.next(data);
                    return this.futureGoalsSubject.value;
                }
            ),
            catchError(
                error => {
                    this.futureGoalsSubject.next([] as Goal[]);
                    return throwError(error);
                }
            )
        );
    }

    getExpiredGoals(username: string): Observable<Goal[]> {
        return this.apiService.get(`/profiles/${username}/goals?filter=expired`).pipe(
            map(
                data => {
                    this.expiredGoalsSubject.next(data);
                    return this.expiredGoalsSubject.value;
                }
            ),
            catchError(
                error => {
                    this.expiredGoalsSubject.next([] as Goal[]);
                    return throwError(error);
                }
            )
        );
    }

    getGoalCategories() {
        return this.apiService.get('/goal_categories').pipe(
            map(
               (data : GoalCategory[]) => {
                console.log("Goal category information retrieved.");
                    return data;
                }
            )
        );
    }

    getGoalByID(username: string, id: number) {
        return this.apiService.get(`/profiles/${username}/goals/${id}`).pipe(
            map(
               (data : Goal) => {
                    return data;
                }
            )
        );        
    }

    createNewGoal(username: string, startDate:Date, duration:number, startValue:number, targetValue:number, categoryID:number) {
        var startAtString = startDate.toISOString();
        return this.apiService.post(`/profiles/${username}/goals`,
                                    { startAt: startAtString, duration: duration, startValue: startValue,
                                        targetValue: targetValue, categoryID: categoryID }
                                    ).pipe(
                                        map((data: Goal) => {
                                                console.log("Goal created");
                                                this.getFutureGoals(username).pipe(first()).subscribe();
                                                return data;
                                            }
                                        )
                                    );
    }
}
