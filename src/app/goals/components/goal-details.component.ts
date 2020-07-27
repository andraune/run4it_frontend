import { Component, OnInit, OnChanges, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { GoalService, NotificationService, ProfileService, Goal, Profile } from '../../api-common';


@Component({
  selector: 'app-goal-details',
  templateUrl: './goal-details.component.html',
  styleUrls: ['../goals.component.css']
})
export class GoalDetailsComponent implements OnInit, OnChanges, OnDestroy {
    @Input() id: number = 0;
    @Input() showHeading: boolean = true;
    public isLoading: boolean = false;

    private profileSubscription: Subscription = null;
    public profile: Profile;
    public goal: Goal = null;

    constructor( 
        private goalService: GoalService,
        private notificationService: NotificationService,
        private profileService: ProfileService
    ) 
    {}

    ngOnInit() {
        this.profileSubscription = this.profileService.profile.subscribe((profileData: Profile) => { this.profile = profileData; }); 
        this.getGoalData(this.id);  
    }

    ngOnChanges() {
        if (this.profileSubscription) { // are we initialized?
            this.getGoalData(this.id)
        }
    }

    ngOnDestroy() {
        if (this.profileSubscription) {
            this.profileSubscription.unsubscribe();
        }
    }

    getGoalData(goalID: number) {
        
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
