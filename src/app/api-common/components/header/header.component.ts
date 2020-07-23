import { Component, OnInit } from '@angular/core';

import { User } from '../../models';
import { AuthenticationService } from '../../services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public authUser: User;
  public userMenuOpen = false;
  public menuItems = [
    {route: "/dashboard", title: "Dashboard", icon: "dashboard" },
    {route: "/workouts", title: "Workouts", icon: "directions_run" },
    {route: "/goals", title: "Goals", icon: "flag" }
  ];

  constructor(private authService: AuthenticationService) {
  }

  ngOnInit() {
    this.authService.authenticatedUser$.subscribe(
      (userData: User) => this.authUser = userData
    );
  }

  showUserMenu(doShow:boolean) {
    this.userMenuOpen = doShow;
  }
}
