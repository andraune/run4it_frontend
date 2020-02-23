import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first, finalize } from 'rxjs/operators';
import { Profile, ProfileService, UserService, NotificationService, User } from '../api-common';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private profileService: ProfileService,
    private userService: UserService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
  )
  {}

  ngOnInit() {
    this.userInfoForm = this.formBuilder.group({
      'birthYear': ['', Validators.compose([Validators.min(1900), Validators.max(2009)])], // TODO: Max-value given by current year
      'birthMonth': ['', Validators.compose([Validators.min(1), Validators.max(12)])],
      'birthDay': ['', Validators.compose([Validators.min(1), Validators.max(31)])],
      'weight': ['', Validators.compose([Validators.min(0), Validators.max(999)])],
      'height': ['', Validators.compose([Validators.min(0), Validators.max(299)])]
    });

    this.userService.currentUser.subscribe(
      (userData: User) => this.currentUser = userData
    );

    this.profileService.profile.subscribe(
      (profileData: Profile) => {
        this.profile = profileData;
        
        if (this.profile.birthDate) {
          var birthDate = new Date(this.profile.birthDate);
          this.userInfoForm.controls.birthYear.setValue(birthDate.getUTCFullYear());
          this.userInfoForm.controls.birthMonth.setValue((birthDate.getUTCMonth() + 1).toString().padStart(2, '0'));
          this.userInfoForm.controls.birthDay.setValue(birthDate.getUTCDate().toString().padStart(2, '0'));
        }

        if (this.profile.height) {
          this.userInfoForm.controls.height.setValue(this.profile.height);
        }
        
        if (this.profile.weight) {
          this.userInfoForm.controls.weight.setValue(this.profile.weight);
        }       
        



        // TODO: Fetch currentUser and check that usernames match
      }
    );
  }

  submitUserInfoForm() {
    console.log("submitUserInfoForm submit");
    this.isSubmitting = true;
  }

  logout() {
    this.isSubmitting = true;

    this.userService.logoutRefresh()
      .pipe(
        first(),
        finalize(() => {
          this.userService.logout()
          .pipe(
            first(),
            finalize(() => {
              this.notificationService.addInfo(0, "logout", "Logged out!", true);
              this.router.navigateByUrl('/');
            })
          )
          .subscribe();
        })
      )
      .subscribe();
  }
}
