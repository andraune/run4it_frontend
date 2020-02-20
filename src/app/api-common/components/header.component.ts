import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first, finalize } from 'rxjs/operators';

import { User } from '../models';
import { UserService } from '../services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public userMenuOpen: boolean;
  public menuItems: any[] = [];
  public currentUser: User;

  constructor(private userService: UserService, private router: Router) {
  }

  ngOnInit() {
    this.userService.currentUser.subscribe(
      (userData: User) => this.currentUser = userData
    );

    this.userMenuOpen = false;
    this.menuItems.push({route: "/dashboard", title: "Dashboard"})
    this.menuItems.push({route: "/workouts", title: "Workouts"})
    this.menuItems.push({route: "/new-workout", title: "Add Workouts"})
  }

  showUserMenu(doShow:boolean) {
    this.userMenuOpen = doShow;
  }




  logout() {
    this.userService.logoutRefresh()
      .pipe(
        first(),
        finalize(() => {
          this.userService.logout()
          .pipe(
            first(),
            finalize(() => {
              // TODO: Add notification?
              this.router.navigate(['/']);
            })
          )
          .subscribe(); 
        })
      )
      .subscribe();
  }
}
