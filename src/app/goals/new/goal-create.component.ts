import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { GoalService, ProfileService, NotificationService, Goal, GoalCategory, Profile, ProfileWeight } from '../../api-common';


@Component({
  selector: 'app-goal-create',
  templateUrl: './goal-create.component.html',
  styleUrls: ['../goals.component.css', 'goal-create.component.css']
})
export class GoalCreateComponent implements OnInit {

    private profileSubscription: Subscription = null;
    public profile: Profile;

    // Step headings
    public goalCategoryHeading: string = "";
    public goalTargetHeading: string = "";
    public goalTargetInputHeading: string = "";
    public goalDatesHeading: string = "";

    // Step 1
    public goalCategories: GoalCategory[] = [];
    public goalCategoryForm: FormGroup;
    public selectedGoalCategoryID: number = 0;
    public selectedGoalCategory: GoalCategory = {} as GoalCategory;

    // Step 2
    public goalTargetForm: FormGroup;
    public goalTargetValue: number = 0;

    // Step 3
    public startDateMin: Date = new Date();
    public endDateMin: Date = new Date();
    public goalDurationDays: number = 0;
    public goalDatesForm: FormGroup;
    public selectedGoalStartDate: Date = null;
    public selectedGoalEndDate: Date = null;
    

    constructor(
        private profileService: ProfileService,
        private goalService: GoalService,
        private notificationService: NotificationService,
        private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.profileSubscription = this.profileService.profile.subscribe((profileData: Profile) => { this.profile = profileData; });

        this.goalCategoryForm = this.formBuilder.group({
            'categoryID': ["", Validators.compose([Validators.required, Validators.min(1)])],
          });

        this.goalTargetForm = this.formBuilder.group({
            'target': ["", Validators.compose([Validators.required, Validators.min(1)])],
          });

        this.goalDatesForm = this.formBuilder.group({
            'startDate': ["", Validators.required],
            'endDate': ["", Validators.required],
        });
        
        this._getGoalCategoryList();
        this._updateHeadings();
        this._updateGoalDates();
    }

    ngOnDestroy() {
        if (this.profileSubscription) {
            this.profileSubscription.unsubscribe();
        }        
    }

    public selectedCategoryChanged() {
        if (this.selectedGoalCategoryID > 0) {
            for (var i=0; i < this.goalCategories.length; ++i) {
                if (this.goalCategories[i].id == this.selectedGoalCategoryID) {
                    this.selectedGoalCategory = this.goalCategories[i];
                    break;
                }                
            }
        }
        else {
            this.selectedGoalCategory = {} as GoalCategory;
        }

        if (this.selectedGoalCategory.name == "Weight loss") {
            this.selectedTargetChanged(); // Force check of weight target validity
        }

        this._updateHeadings();
    }

    public selectedTargetChanged() {
        this.goalTargetForm.controls["target"].setValue(this.goalTargetForm.controls["target"].value.toString().replace(',', '.'));
        this.goalTargetValue = this.goalTargetForm.controls["target"].value;

        if ((this.selectedGoalCategory.name == "Weight loss")) {
            if ((this.profile.weight) && (this.profile.weight > 1.0)) {
                // Profile weight is set, control that target is lower than actual
                if (this.profile.weight <= this.goalTargetValue) {
                    this.goalTargetForm.controls["target"].setValue((this.profile.weight - 1));
                    this.goalTargetValue = this.goalTargetForm.controls["target"].value;
                }
            }
            else {
                // Profile weight not set, unable to create weight goal
                this.goalTargetForm.controls["target"].setValue('');
                this.goalTargetValue = this.goalTargetForm.controls["target"].value;
            }
        }

        this._updateHeadings();
    }

    public selectedGoalDateChanged() {
        if (this.goalDatesForm.controls["startDate"].value) {
           this.selectedGoalStartDate = this.goalDatesForm.controls["startDate"].value; 
        }

        if (this.goalDatesForm.controls["endDate"].value) {
            this.selectedGoalEndDate = this.goalDatesForm.controls["endDate"].value;
        }

        this._updateGoalDates();
        this._updateHeadings();
    }

    public createGoal() {
        alert("Create clicked!");
    }


    private _updateHeadings() {
        const categoryPrefix = "Goal category";
        const targetPrefix = "Goal target";
        const targetInputPrefix = "Specify target";
        const datesPrefix = "Goal period";

        if (this.selectedGoalCategory.id > 0) {
            if (this.selectedGoalCategory.workoutCategoryName != "") {
                this.goalCategoryHeading = categoryPrefix + ": " + this.selectedGoalCategory.name + ", " + this.selectedGoalCategory.workoutCategoryName.toLowerCase();
            }
            else {
                this.goalCategoryHeading = categoryPrefix + ": " + this.selectedGoalCategory.name;
            }

            if (this.selectedGoalCategory.name == "Cumulative distance") {
                this.goalTargetInputHeading = "Target distance";
            }
            else if (this.selectedGoalCategory.name == "Cumulative climb") {
                this.goalTargetInputHeading = "Target climb";
            }
            else if (this.selectedGoalCategory.name == "Workout count") {
                this.goalTargetInputHeading = "Number of workouts";
            }
            else if (this.selectedGoalCategory.name == "Weight loss") {
                this.goalTargetInputHeading = "Target weight";
            }
            else {
                this.goalTargetInputHeading = targetInputPrefix; 
            }

            if (this.goalTargetValue > 0) {
                if (this.selectedGoalCategory.unit != "#") {
                    this.goalTargetHeading = targetPrefix + ": " + this.goalTargetValue + " " + this.selectedGoalCategory.unit;
                }
                else {
                    this.goalTargetHeading = targetPrefix + ": " + this.goalTargetValue + " workouts";
                }
            }
            else {
                this.goalTargetHeading = targetPrefix;
            }
        }
        else {
            this.goalCategoryHeading = categoryPrefix;
            this.goalTargetHeading = targetPrefix;
            this.goalTargetInputHeading = targetInputPrefix;
        }

        if (this.selectedGoalStartDate && this.selectedGoalEndDate) {
            const dateOptions = { year: 'numeric', month: 'short', day: 'numeric'};
            const startDateFormatted = new Intl.DateTimeFormat("en-GB", dateOptions).format(this.selectedGoalStartDate);
            const endDateFormatted = new Intl.DateTimeFormat("en-GB", dateOptions).format(this.selectedGoalEndDate);
            this.goalDatesHeading = datesPrefix + ": " + startDateFormatted + " to " + endDateFormatted;
        }
        else {
            this.goalDatesHeading = datesPrefix;
        }
    }

    private _updateGoalDates() {
        if (this.selectedGoalStartDate) {
            this.endDateMin = new Date(this.selectedGoalStartDate.getFullYear(), this.selectedGoalStartDate.getMonth(), this.selectedGoalStartDate.getDate()+1);
        }
        else {
            this.endDateMin = new Date(this.startDateMin.getFullYear(), this.startDateMin.getMonth(), this.startDateMin.getDate()+1);
        }

        if (this.selectedGoalStartDate && this.selectedGoalEndDate) {
            this.goalDurationDays = Math.round((this.selectedGoalEndDate.getTime() - this.selectedGoalStartDate.getTime()) / (86400*1000));
        }
        else {
            this.goalDurationDays = 0;
        }
    }

    private _getGoalCategoryList() {
        this.goalService.getGoalCategories().pipe(take(1)).subscribe(
            (data: GoalCategory[]) => {
                this.goalCategories = data;
            },
            err => {
                this.goalCategories = [];
                this.notificationService.addError(0, "", "Failed to load goal categories", false);
            }
        );        
    }
}
