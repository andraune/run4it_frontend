import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User, AuthenticationService, NotificationService, Goal, GoalCategory, GoalService, ApiService } from '../../api-common';


@Component({
  selector: 'app-goal-create',
  templateUrl: './goal-create.component.html',
  styleUrls: ['../goals.component.css']
})
export class GoalCreateComponent implements OnInit {

    private NUM_OF_STEPS = 3;
    public currentStep: number = 1;
    public selectedGoalCategoryDescr: string = "";
    public goalForm: FormGroup;
    public isSubmitting = false;

    private currentUser: User; 
    public goalCategories: GoalCategory[] = [];


    constructor(
        private authService: AuthenticationService,
        private notificationService: NotificationService,
        private goalService: GoalService,
        private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.authService.authenticatedUser$.subscribe(
            (userData: User) => this.currentUser = userData
        );

        this.goalService.goalCategories.subscribe(
            (goalCategoryData: GoalCategory[]) => {
                this.goalCategories = goalCategoryData;
            }
        );

        this.goalForm = this.formBuilder.group({
            'categoryID': ['', Validators.compose([Validators.required, Validators.min(1)])],
          });

          this.goalForm.controls.categoryID.setValue(0);
    }

    onCategoryChanged() {
        if (this.goalForm.controls.categoryID.value < this.goalCategories.length) {
            var category = this.goalCategories[this.goalForm.controls.categoryID.value];
            this.selectedGoalCategoryDescr = category.name + "[" + category.unit + "]";

            if (category.workoutCategoryName != "") {
                this.selectedGoalCategoryDescr += "(" + category.workoutCategoryName + ")";
            }
        }
    }

    setStepToPrevious(currentStep:number) {
        if (currentStep > 1) {
            this.currentStep -= 1;
        }
    }

    setStepToNext(currentStep:number) {
        if (currentStep < this.NUM_OF_STEPS) {
            this.currentStep += 1;
        }
    }


    submitForm() {
        this.notificationService.clearAll();
        const canSubmit = !this.goalForm.invalid;
        const controls = this.goalForm.controls;

        if (canSubmit) {   
            this.isSubmitting = true;
        }
        else {
            for (const name in controls) {
                if (controls[name].invalid) {
                    this.notificationService.addError(0, '', `Invalid value provided for '${name}'.`);
                }
            }
        }
    }
}
