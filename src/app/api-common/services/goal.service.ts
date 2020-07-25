import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

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
    private goalCategoriesSubject: BehaviorSubject<GoalCategory[]>;
    public goalCategories: Observable<GoalCategory[]>;

    constructor(private apiService: ApiService) {
        this.activeGoalsSubject = new BehaviorSubject<Goal[]>([] as Goal[]);
        this.activeGoals = this.activeGoalsSubject.asObservable();
        this.futureGoalsSubject = new BehaviorSubject<Goal[]>([] as Goal[]);
        this.futureGoals = this.futureGoalsSubject.asObservable();
        this.expiredGoalsSubject = new BehaviorSubject<Goal[]>([] as Goal[]);
        this.expiredGoals = this.expiredGoalsSubject.asObservable();
        this.goalCategoriesSubject = new BehaviorSubject<GoalCategory[]>([] as GoalCategory[]);
        this.goalCategories = this.goalCategoriesSubject.asObservable();
    }

    getActiveGoals(username: string): Observable<Goal[]> {
        return this.apiService.get(`/profiles/${username}/goals`).pipe(
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

    getGoalCategories(): Observable<GoalCategory[]> {
        return this.apiService.get('/goal_categories').pipe(
            map(
                data => {
                    this.goalCategoriesSubject.next(data);
                    return this.goalCategoriesSubject.value;
                }
            ),
            catchError(
                error => {
                    this.goalCategoriesSubject.next([] as GoalCategory[]);
                    return throwError(error);
                }
            )
        );
    }
}
