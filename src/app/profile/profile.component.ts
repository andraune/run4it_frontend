import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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

  public months = [
    { name: 'Jan', val: 1, days: 31},
    { name: 'Feb', val: 2, days: 29},
    { name: 'Mar', val: 3, days: 31},
    { name: 'Apr', val: 4, days: 30},
    { name: 'May', val: 5, days: 31},
    { name: 'Jun', val: 6, days: 30},
    { name: 'Jul', val: 7, days: 31},
    { name: 'Aug', val: 8, days: 31},
    { name: 'Sep', val: 9, days: 30},
    { name: 'Oct', val: 10, days: 31},
    { name: 'Nov', val: 11, days: 30},
    { name: 'Dec', val: 12, days: 31}
  ];
  public days = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private profileService: ProfileService,
    private authService: AuthenticationService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
  )
  {}

  ngOnInit() {
    this._populateDays(2000, 0); // default: January 2000
    this.userInfoForm = this.formBuilder.group({
      'birthYear': ['', Validators.compose([Validators.required, Validators.min(1900), Validators.max(2009)])], // TODO: Max-value given by current year
      'birthMonth': [ 1 ],
      'birthDay': [ 1 ],
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
      var birthDateStr = controls.birthYear.value + '-' + controls.birthMonth.value + '-' + controls.birthDay.value;
      this.profileService.updateProfileUserInfo(this.currentUser.username, birthDateStr, controls.height.value, controls.weight.value.toString().replace(',', '.'))
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

  private _updateUserInfoForm() {
    if (this.profile.birthDate) {
      var birthDate = new Date(this.profile.birthDate);
      this._populateDays(birthDate.getUTCFullYear(), birthDate.getUTCMonth());
      this.userInfoForm.controls.birthYear.setValue(birthDate.getUTCFullYear());
      this.userInfoForm.controls.birthMonth.setValue(birthDate.getUTCMonth() + 1);
      this.userInfoForm.controls.birthDay.setValue(birthDate.getUTCDate());
    }

    if (this.profile.height) {
      this.userInfoForm.controls.height.setValue(this.profile.height);
    }
    
    if (this.profile.weight) {
      this.userInfoForm.controls.weight.setValue(this.profile.weight);
    }
  }

  onMonthChanged(month: number) {
    this._populateDays(this.userInfoForm.controls.birthYear.value, this.userInfoForm.controls.birthMonth.value - 1);
  }

  onYearChanged(year: number) {
    this._populateDays(this.userInfoForm.controls.birthYear.value, this.userInfoForm.controls.birthMonth.value - 1);
  }

  private _populateDays(year:number, month:number) {
    this.days = [];
    var i = 1;
    while (i <= this.months[month].days) {
      if (month == 1) { // February
        const isLeapYear = (new Date(year, 1, 29).getMonth() == 1);

        if (!isLeapYear && (i > 28)) {
          break;
        } 
      }

      this.days.push({num: i, numStr: i.toString().padStart(2, '0')});
      i++;
    }
  }
}
