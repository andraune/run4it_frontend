import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Profile, User, ProfileService, UserService, NotificationService } from '../api-common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public profile: Profile;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private profileService: ProfileService,
    private userService: UserService,
    private notificationService: NotificationService
  )
  {}

  ngOnInit() {
    this.profileService.profile.subscribe(
      (profileData: Profile) => {
        this.profile = profileData;
        // TODO: Fetch currentUser and check that usernames match
      }
    );
  }
}
