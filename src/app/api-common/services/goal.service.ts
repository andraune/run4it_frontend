import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { ApiService } from './api.service';
import { GoalInterface } from '../models';

@Injectable({ providedIn: 'root' })
export class GoalService {
    private activeGoalsSubject: BehaviorSubject<GoalInterface[]>;
    public activeGoals: Observable<GoalInterface[]>; 
    private futureGoalsSubject: BehaviorSubject<GoalInterface[]>;
    public futureGoals: Observable<GoalInterface[]>; 
    constructor(private apiService: ApiService) {
        this.activeGoalsSubject = new BehaviorSubject<GoalInterface[]>([] as GoalInterface[]);
        this.activeGoals = this.activeGoalsSubject.asObservable().pipe();
        this.futureGoalsSubject = new BehaviorSubject<GoalInterface[]>([] as GoalInterface[]);
        this.futureGoals = this.futureGoalsSubject.asObservable().pipe();
    }

    getActiveGoals(username: string): Observable<GoalInterface[]> {
        return this.apiService.get(`/profiles/JonnyIT/goals`).pipe(
            map(
                data => {
                    console.log("received active goals data");
                    this.activeGoalsSubject.next(data);
                    return this.activeGoalsSubject.value;
                }
            ),
            catchError(
                error => {
                    console.log("failed to get future goals");
                    this.activeGoalsSubject.next([] as GoalInterface[]);
                    return throwError(error);
                }
            )
        );
    }

    getFutureGoals(username: string): Observable<GoalInterface[]> {
        return this.apiService.get(`/profiles/JonnyIT/goals?filter=future`).pipe(
            map(
                data => {
                    console.log("received future goals data");
                    this.futureGoalsSubject.next(data);
                    return this.futureGoalsSubject.value;
                }
            ),
            catchError(
                error => {
                    console.log("failed to get future goals");
                    this.futureGoalsSubject.next([] as GoalInterface[]);
                    return throwError(error);
                }
            )
        );
    }
}
