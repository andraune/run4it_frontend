import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first, finalize } from 'rxjs/operators';
import { Profile, ProfileService, AuthenticationService, NotificationService, User } from '../api-common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public profile: Profile;
  public currentUser: User;
  public userInfoForm: FormGroup;
  public isSubmitting = false;
  public isEditEnabled = false;
  public minDate : Date = new Date(new Date().getUTCFullYear() - 100, 0, 1);
  public maxDate : Date = new Date(new Date().getUTCFullYear() - 12, 0, 1);

  constructor(
    private router: Router,
    private profileService: ProfileService,
    private authService: AuthenticationService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
  )
  {}

  ngOnInit() {
    this.userInfoForm = this.formBuilder.group({
      'birthDate': ['', Validators.compose([Validators.required])],
      'weight': ['', Validators.compose([Validators.min(0), Validators.max(999)])],
      'height': ['', Validators.compose([Validators.required, Validators.min(0), Validators.max(299)])]
    });

    this.authService.authenticatedUser$.subscribe(
      (userData: User) => this.currentUser = userData
    );

    this.profileService.profile.subscribe(
      (profileData: Profile) => {
        this.profile = profileData;
        this._updateUserInfoForm();
      }
    );
  }

  submitUserInfoForm() {
    const canSubmit = !this.userInfoForm.invalid;
    const controls = this.userInfoForm.controls;
    this.notificationService.clearAll();

    if (canSubmit) {
      this.isSubmitting = true;
      this.isEditEnabled = false;
      var birthDate = new Date(controls.birthDate.value);
      var birthDateStr = birthDate.getFullYear() + '-' + (birthDate.getMonth() + 1) + '-' + birthDate.getDate();
      this.profileService.updateProfileUserInfo(this.currentUser.username, birthDateStr, controls.height.value)
        .pipe(first())
          .subscribe(
            () => {
              this.notificationService.addInfo(0, 'Updated', 'User information updated.');
              this.isSubmitting = false;
            },
            err => {
              this.isSubmitting = false;
              this._updateUserInfoForm();
            }
          )
    }
    else {
      for (const name in this.userInfoForm.controls) {
        if (this.userInfoForm.controls[name].invalid) {
          this.notificationService.addError(0, '', `Invalid value provided for '${name}'.`);
        }
      }    
    }
  }

  logout() {
    this.isSubmitting = true;
    this.authService.logoutRefresh()
      .pipe(
        first(),
        finalize(() => {
          this.authService.logout()
          .pipe(
            first(),
            finalize(() => {
              this.router.navigateByUrl('/');
            })
          )
          .subscribe();
        })
      )
      .subscribe();
  }

  toggleEditProfileView()
  {
    if (this.isEditEnabled) {
      this._updateUserInfoForm();
    }

    this.isEditEnabled = !this.isEditEnabled;
  }

  private _updateUserInfoForm() {
    if (this.profile.birthDate) {
      this.userInfoForm.controls.birthDate.setValue(this.profile.birthDate);
    }

    if (this.profile.height) {
      this.userInfoForm.controls.height.setValue(this.profile.height);
    }
    
    if (this.profile.weight) {
      this.userInfoForm.controls.weight.setValue(this.profile.weight.toFixed(1));
    }
  }
}
