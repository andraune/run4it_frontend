import { Component, OnInit, OnChanges, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { GoalService, NotificationService, ProfileService, Goal, Profile } from '../../api-common';


@Component({
  selector: 'app-goal-details',
  templateUrl: './goal-details.component.html',
  styleUrls: ['../goals.component.css', 'goal-details.component.css']
})
export class GoalDetailsComponent implements OnInit, OnChanges, OnDestroy {
    @Input() id: number = 0;
    @Input() showHeading: boolean = true;
    public isLoading: boolean = false;

    private profileSubscription: Subscription = null;
    public profile: Profile;
    public goal: Goal = null;
    
    public currentTime: Date = new Date();

    constructor( 
        private goalService: GoalService,
        private notificationService: NotificationService,
        private profileService: ProfileService
    ) {
        setInterval(() => { this.currentTime = new Date() }, 60000);
    }

    ngOnInit() {
        this.profileSubscription = this.profileService.profile.subscribe((profileData: Profile) => { this.profile = profileData; }); 
        this._getGoalData(this.id);  
    }

    ngOnChanges() {
        if (this.profileSubscription) { // are we initialized?
            this._getGoalData(this.id);
        }
    }

    ngOnDestroy() {
        if (this.profileSubscription) {
            this.profileSubscription.unsubscribe();
        }
    }

    public isGoalStarted() : boolean {
        var startDate = new Date(this.goal.startAt);
        return startDate <= this.currentTime;
    }

    public isGoalExpired(): boolean {
        var endDate = new Date(this.goal.endAt);
        return endDate < this.currentTime;
    }

    public isGoalActive(): boolean {
        return this.isGoalStarted() && (!this.isGoalExpired());
    }

    public isGoalCompleted(): boolean {
        var isCompleted = false;

        if (this.goal.targetValue > this.goal.startValue) {
            isCompleted = this.goal.currentValue >= this.goal.targetValue;
        }
        else {
            isCompleted = this.goal.currentValue <= this.goal.targetValue;
        }

        return isCompleted;
    }

    public getTotalGoalAmount(): number {
        return Math.abs(this.goal.targetValue - this.goal.startValue); 
    }

    public getCompletedGoalAmount(): number {
        return Math.abs(this.goal.currentValue - this.goal.startValue); 
    }

    private _getGoalData(goalID: number) {
        
        this.isLoading = true;
        this.goalService.getGoalByID(this.profile.username, goalID).pipe(take(1)).subscribe(
            (data : Goal) => {
                this.goal = data;
                this.isLoading = false;
            },
            err => {
                this.goal = null;
                this.isLoading = false;
                this.notificationService.addError(0, '', `Failed to get goal data for ID=${goalID}.`);
            }
        );
    }
}
