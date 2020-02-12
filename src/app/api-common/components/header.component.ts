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

  private currentUser: User;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.userService.currentUser.subscribe(
      (userData: User) => this.currentUser = userData
    );
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
              this.router.navigateByUrl("/");
            })
          )
          .subscribe(); 
        })
      )
      .subscribe();
  }
}
