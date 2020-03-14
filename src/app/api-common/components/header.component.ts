import { Component, OnInit } from '@angular/core';

import { User } from '../models';
import { UserService } from '../services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public currentUser: User;
  public userMenuOpen = false;
  public menuItems = [
    {route: "/dashboard", title: "Dashboard"},
    {route: "/workouts", title: "Workouts"},
    {route: "/goals", title: "Goals"}
  ];

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.userService.currentUser.subscribe(
      (userData: User) => this.currentUser = userData
    );
  }

  showUserMenu(doShow:boolean) {
    this.userMenuOpen = doShow;
  }
}
