import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { Goal, GoalService } from '../../api-common';


@Component({
  selector: 'app-goal-summary',
  templateUrl: './goal-summary.component.html',
  styleUrls: ['../goals.component.css']
})
export class GoalSummaryComponent implements OnInit {

    public isCreateNewRoute: boolean = false;
    
    public activeGoals: Goal[] = [];
    public futureGoals: Goal[] = [];
    public expiredGoals: Goal[] = [];
    public goalsCompleted: number = 0;
    public goalsSuccessRate: number = 0;
    public currentTime: Date = new Date();

    constructor(private router: Router, private goalService: GoalService) {
        setInterval(() => { this.currentTime = new Date() }, 60000);

        router.events.subscribe(
            (event: Event) => {
                if (event instanceof NavigationEnd) {
                    this.isCreateNewRoute = (event.url == "/goals/new");
                }
            }
        );

    }

    ngOnInit() {
        this.goalService.activeGoals.subscribe(
            (goalData: Goal[]) => { this.activeGoals = goalData; }
        );

        this.goalService.futureGoals.subscribe(
            (goalData: Goal[]) => { this.futureGoals = goalData; }
        );

        this.goalService.expiredGoals.subscribe(
            (goalData: Goal[]) => {
                this.expiredGoals = goalData;
                this.updateGoalStats();
            }
        );
    }

    private updateGoalStats() {

        if (this.expiredGoals.length > 0) {

            this.expiredGoals.forEach(goal => {
                if ((goal.startValue < goal.targetValue) && (goal.currentValue >= goal.targetValue)
                    || (goal.startValue > goal.targetValue) && (goal.currentValue <= goal.targetValue)) {

                    this.goalsCompleted += 1;
                }
            });

            this.goalsSuccessRate = Math.round(100.0 * this.goalsCompleted / (1.0*this.expiredGoals.length));
        }
        else {
            this.goalsCompleted = 0;
            this.goalsSuccessRate = 0;
        }
    }
}
