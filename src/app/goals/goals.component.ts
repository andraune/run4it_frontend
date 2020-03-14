import { Component, OnInit } from '@angular/core';

import { User, UserService, GoalInterface, GoalService, ApiService } from '../api-common';


@Component({
  selector: 'app-goals',
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.css']
})
export class GoalsComponent implements OnInit {
    private currentUser: User;
    public activeGoals: GoalInterface[] = [];
    public futureGoals: GoalInterface[] = [];
    public currentTime: Date = new Date();

    constructor(
        private userService: UserService,
        private goalService: GoalService,
        private apiService: ApiService
    ) 
    {
        setInterval(() => { this.currentTime = new Date() }, 60000);
    }

    ngOnInit() {
        this.userService.currentUser.subscribe(
            (userData: User) => this.currentUser = userData
        );

        this.goalService.activeGoals.subscribe(
            (goalData: GoalInterface[]) => {
                this.activeGoals = goalData;
            }
        )

        this.goalService.getFutureGoals(this.currentUser.username)
        .pipe()
          .subscribe(
            (goalData: GoalInterface[]) => { this.futureGoals = goalData; },
            err => {
                // TODO: Add error note or sumtin'
            }
          );
    }
}
