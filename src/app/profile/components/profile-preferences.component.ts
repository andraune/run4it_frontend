import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { Profile, PolarUser, ProfileService } from '../../api-common';
import { ThrowStmt } from '@angular/compiler';


@Component({
  selector: 'app-profile-preferences',
  templateUrl: './profile-preferences.component.html',
  styleUrls: ['./../profile.component.css', './profile-preferences.component.css']
})
export class ProfilePreferencesComponent implements OnInit, OnDestroy {

    private polarCallbackStartDate: Date = null;
    private subscriptions: Subscription[] = [];
    public profile: Profile = {} as Profile;

    public polarUser: PolarUser = {} as PolarUser;  
    public isFetchingPolar: boolean = false;

    constructor(private profileService: ProfileService)
    {
    }

    ngOnInit() {

        this.subscriptions.push(this.profileService.profile.subscribe((profileData: Profile) => { this.profile = profileData; }));
        this._getPolarUser();
    }

    ngOnDestroy(){
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    public canShowConnectToPolarButton() {
        if (this.polarUser) {
           return ((this.polarUser.authUrl == null) || (this.polarUser.authUrl == '')); 
        }

        return true;
    }

    public canShowPolarButton() {
        return ((this.polarUser) && (this.polarUser.authUrl));
    }

    public isPolarTokenExpired() {
        if ((this.polarUser) && (this.polarUser.polarUserID > 0)) {
            const tokenExpiry = new Date(this.polarUser.accessTokenExpiresAt);
            const now = new Date();
            return (now >= tokenExpiry);
        }
        
        return false;
    }

    public registerPolarConnectRequest() {
        this.isFetchingPolar = true;

        this.profileService.registerProfilePolarUser(this.profile.username).pipe(first()).subscribe(
            (data: PolarUser) => {
                this.polarUser = data;
                this.isFetchingPolar = false;
            },
            err => {
                this.polarUser = {} as PolarUser;
                this.isFetchingPolar = false;             
            }
        );
    }

    public startCallbackPolling() {
        this.polarCallbackStartDate = new Date();
        console.log("Should start polling of Polar status. Check every X secs and stop we get updatedDate > polarCallbackStartDate");
    }

    private _getPolarUser() {
        this.isFetchingPolar = true;

        this.profileService.getProfilePolarUser(this.profile.username).pipe(first()).subscribe(
            (data: PolarUser) => {
                if (data) {
                    this.polarUser = data;
                }
                else {
                    this.polarUser = {} as PolarUser;
                }
                this.isFetchingPolar = false;
            },
            err => {
                this.polarUser = {} as PolarUser;
                this.isFetchingPolar = false;             
            }
        );
    }
}
