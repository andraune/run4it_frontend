import { Component, OnInit, ViewChild } from '@angular/core';
import { first, finalize } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Profile, ProfileWeight, ProfileService, AuthenticationService, NotificationService, User } from '../../api-common';


@Component({
  selector: 'app-profile-weight-history',
  templateUrl: './weight-history.component.html',
  styleUrls: ['./../profile.component.css', './weight-history.component.css']
})
export class WeightHistoryComponent implements OnInit {

  public weightList : ProfileWeight[] = [];
  public displayedColumns: string[] = ['createdAt', 'weight'];
  public displayWeightTable : boolean = false;

  public profile: Profile;
  public currentUser: User;
  
  public weightForm: FormGroup;
  public isSubmitting = false;
  public isFetchingWeight = false;
  public isFetchingError = false;

  public weigthChartColorScheme = { domain: ['#083b66'] };
  public weightChartData: any[] = [{"name": "Weight", "series":[]}];

  constructor(
    private profileService: ProfileService,
    private authService: AuthenticationService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
  )
  {
  }

  ngOnInit() {
    this.weightForm = this.formBuilder.group({
      'weight': ['', Validators.compose([Validators.min(0), Validators.max(999)])],
    });

    this.authService.authenticatedUser$.subscribe(
      (userData: User) => this.currentUser = userData
    );

    this.profileService.profile.subscribe(
      (profileData: Profile) => {
        this.profile = profileData;
        this._clearWeightForm();
      }
    );
    
    this._getWeightData();
  }

  toggleWeightTableView()
  {
    this.displayWeightTable = !this.displayWeightTable;
  }

  submitWeightForm()
  {
    const canSubmit = !this.weightForm.invalid;
    const controls = this.weightForm.controls;
    this.notificationService.clearAll();

    if (canSubmit) {
      this.isSubmitting = true;

      this.profileService.updateProfileWeight(this.currentUser.username, controls.weight.value.toString().replace(',', '.'))
        .pipe(first(), finalize(() => { this._getWeightData(); }))
          .subscribe(
            () => {
              this.isSubmitting = false;
              this._clearWeightForm();
            },
            err => {
              this.isSubmitting = false;
              this._clearWeightForm();
            }
          )
    }
    else {
      for (const name in this.weightForm.controls) {
        if (this.weightForm.controls[name].invalid) {
          this.notificationService.addError(0, '', `Invalid value provided for '${name}'.`);
        }
      }    
    }
  }

  private _getWeightData()
  {
    this.isFetchingWeight = true;
  
    this.profileService.getProfileWeightHistory(this.currentUser.username)
      .pipe(first())
      .subscribe(
      (data : ProfileWeight[]) => {
        this.weightList = data;
        this._updateWeightChartData();
        this.isFetchingWeight = false;
        this.isFetchingError = false;
      },
      err => {
        this.isFetchingWeight = false;
        this.isFetchingError = true;
      }
    )
  }

  

  private _updateWeightChartData()
  {
    this.weightChartData[0]["series"] = [];
    var dateOptions = { "year": "2-digit", "month": "short", "day": "numeric" };
  
    this.weightList.forEach(weightData => {   
      var weightDate = new Date(weightData.createdAt);
      var formattedDate = Intl.DateTimeFormat("en-GB", dateOptions).format(weightDate);

      this.weightChartData[0]["series"].push({
        "name": formattedDate,
        "value" : weightData.weight
      });
    });

    this.weightChartData = [... this.weightChartData];
  }

  private _clearWeightForm() { 
    this.weightForm.controls.weight.setValue("");
  }
}

