import { Component, OnInit } from '@angular/core';

import { User, AuthenticationService, Goal, GoalService, ApiService } from '../api-common';


@Component({
  selector: 'app-goals',
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.css']
})
export class GoalsComponent implements OnInit {
    private currentUser: User;
    public activeGoals: Goal[] = [];
    public futureGoals: Goal[] = [];
    public expiredGoals: Goal[] = [];
    public currentTime: Date = new Date();

    constructor(private authService: AuthenticationService, private goalService: GoalService) {
        setInterval(() => { this.currentTime = new Date() }, 60000);
    }

    ngOnInit() {
        this.authService.authenticatedUser$.subscribe(
            (userData: User) => this.currentUser = userData
        );

        this.goalService.activeGoals.subscribe(
            (goalData: Goal[]) => { this.activeGoals = goalData; }
        );

        this.goalService.futureGoals.subscribe(
            (goalData: Goal[]) => { this.futureGoals = goalData; }
        );

        this.goalService.expiredGoals.subscribe(
            (goalData: Goal[]) => { this.expiredGoals = goalData; }
        );
    }
}
