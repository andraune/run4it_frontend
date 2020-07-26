import { Component, OnInit } from '@angular/core';

import { AuthenticationService, Goal, GoalService } from '../../api-common';


@Component({
  selector: 'app-goal-view',
  templateUrl: './goal-overview.component.html',
  styleUrls: ['../goals.component.css']
})
export class GoalOverviewComponent implements OnInit {
    public activeGoals: Goal[] = [];

    constructor(private goalService: GoalService) {}

    ngOnInit() {

        this.goalService.activeGoals.subscribe(
            (goalData: Goal[]) => { this.activeGoals = goalData; }
        );
    }
}
