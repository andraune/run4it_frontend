import { Component, OnInit } from '@angular/core';

import { User } from '../models';
import { AuthenticationService } from '../services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public authUser: User;
  public userMenuOpen = false;
  public menuItems = [
    {route: "/dashboard", title: "Dashboard"},
    {route: "/workouts", title: "Workouts"},
    {route: "/goals", title: "Goals"}
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
