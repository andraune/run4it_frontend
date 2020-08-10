import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { WorkoutService, ProfileService, NotificationService, WorkoutCategory, Workout, Profile } from '../../api-common';


@Component({
  selector: 'app-workout-create',
  templateUrl: './workout-create.component.html',
  styleUrls: ['../workouts.component.css', 'workout-create.component.css']
})
export class WorkoutCreateComponent implements OnInit, OnDestroy {

    private profileSubscription: Subscription = null;
    public profile: Profile;

    // Step headings
    public workoutCategoryHeading: string = "";

    // Step 1
    public workoutCategories: WorkoutCategory[] = [];
    public workoutCategoryForm: FormGroup;
    public selectedWorkoutCategoryID: number;
    public selectedWorkoutCategory: WorkoutCategory;
    public selectedInputMethod: string = "";

    // Step 2 - file upload
    public workoutFileUploadForm: FormGroup;
    public selectedFile: any = null;
    public selectedFileSize:number;
    public selectedFileName: string;

    // Step 2 - manual entry
    public workoutManualInputForm: FormGroup;

    // Step 3


    public canUpload: boolean = false;
    public isSubmitting:boolean = false;
    

    constructor(
        private profileService: ProfileService,
        private workoutService: WorkoutService,
        private notificationService: NotificationService,
        private formBuilder: FormBuilder,
        private router: Router) {
    }

    ngOnInit() {
        this.profileSubscription = this.profileService.profile.subscribe((profileData: Profile) => { this.profile = profileData; });

        this.workoutCategoryForm = this.formBuilder.group({
            'categoryID': ["", Validators.compose([Validators.required, Validators.min(1)])],
            'inputType': ["", Validators.required],
        });

        this.workoutFileUploadForm = this.formBuilder.group({'uploadFile': ["", Validators.required]});

        this.workoutManualInputForm = this.formBuilder.group({
            'name': ["", Validators.required],
        });
        
        this._getWorkoutCategoryList();
        this.resetForms();
    }

    ngOnDestroy() {
        if (this.profileSubscription) {
            this.profileSubscription.unsubscribe();
        }
    }
    
    public resetForms() {
        this.canUpload = false;
        this.isSubmitting = false;
        this.selectedWorkoutCategoryID = 0;
        this.selectedWorkoutCategory = {} as WorkoutCategory;
        this.selectedInputMethod = "upload";
        this.workoutCategoryForm.controls['inputType'].setValue(this.selectedInputMethod);
        this.selectedFile = null;
        this.selectedFileSize = 0;
        this.selectedFileName = "";
        this._updateHeadings();
    }

    public selectedCategoryChanged() {
        if (this.selectedWorkoutCategoryID > 0) {
            for (var i=0; i < this.workoutCategories.length; ++i) {
                if (this.workoutCategories[i].id == this.selectedWorkoutCategoryID) {
                    this.selectedWorkoutCategory = this.workoutCategories[i];
                    break;
                }                
            }
        }
        else {
            this.selectedWorkoutCategory = {} as WorkoutCategory;
        }

        this._updateHeadings();
    }

    public fileInputChanged($event: any) {
        this.selectedFile = $event.target.files[0];
        this.selectedFileName = this.selectedFile.name;
        this.selectedFileSize = Math.round(this.selectedFile.size / 1024);
        this.canUpload = (this.selectedFileName && (this.selectedFileName != ""));
    }

    public uploadWorkoutFile() {
        if (this.canUpload) {
            this.isSubmitting = true;
            this.workoutService.createWorkoutByUpload(this.profile.username, this.selectedWorkoutCategory.id, this.selectedFile).pipe(take(1)).subscribe(
                (data:Workout) => {
                    this.notificationService.addInfo(0, 'New workout', 'Workout created', true);
                    this.router.navigateByUrl(`/workouts/${data.id}`);
                },
                error => {
                    this.notificationService.addError(0, '', 'Failed to upload file.');
                    this.resetForms();
                }
            );
        }
        else {
            this.notificationService.addError(0, '', 'Failed to upload file, invalid data.');
        }

        

        
    }

    private _updateHeadings() {
        const categoryPrefix = "Workout category";

        if (this.selectedWorkoutCategoryID > 0) {
            this.workoutCategoryHeading = categoryPrefix + ": " + this.selectedWorkoutCategory.name;
        }
        else {
            this.workoutCategoryHeading = categoryPrefix;
        }
    }

    private _getWorkoutCategoryList() {
        this.workoutService.getWorkoutCategories().pipe(take(1)).subscribe(
            (data: WorkoutCategory[]) => {
                this.workoutCategories = data;
            },
            err => {
                this.workoutCategories = [];
                this.notificationService.addError(0, "", "Failed to load workout categories", false);
            }
        );
    }

}
