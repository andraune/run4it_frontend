import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { first } from 'rxjs/operators';
import { Profile, PolarUser, ProfileService } from '../../api-common';


@Component({
  selector: 'app-profile-preferences',
  templateUrl: './profile-preferences.component.html',
  styleUrls: ['./../profile.component.css', './profile-preferences.component.css']
})
export class ProfilePreferencesComponent implements OnInit, OnDestroy {

    
    private subscriptions: Subscription[] = [];
    public profile: Profile = {} as Profile;

    public polarUser: PolarUser = {} as PolarUser;  
    public isFetchingPolar: boolean = false;

    private polarWaitSubscription: Subscription = null;
    private polarWaitStartDate: Date = null;

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

    public canShowConnected() {
        if (this.polarUser && (this.polarUser.polarUserID > 0)) {
            return !this.isPolarTokenExpired();
        }
    }

    public canShowConnectToPolarButton() {
        if (this.polarUser) {
           return ((this.polarUser.memberID == null) || (this.polarUser.memberID == '')); 
        }

        return true;
    }

    public canShowPolarButton() {
        return ((this.polarUser) && (this.polarUser.authUrl) && (this.polarUser.authUrl != ""));
    }

    public isPolarTokenExpired() {
        if ((this.polarUser && this.polarUser.accessTokenExpiresAt)) {
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
        if (this.polarWaitSubscription == null) {
            this.polarWaitStartDate = new Date();
            this.polarWaitSubscription = interval(6000).subscribe(
                () => {
                    var isRegistered: boolean = this.canShowConnected();

                    if ((!isRegistered) && (!this.isFetchingPolar)) {
                        this._getPolarUser();
                    }

                    const now = new Date();
                    if (isRegistered || ((now.getTime() - this.polarWaitStartDate.getTime()) > 60000)) {
                        this.polarWaitSubscription.unsubscribe();
                        this.polarWaitSubscription = null;
                    }  
                }
            );
        }
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
