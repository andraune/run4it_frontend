import { Component, OnInit } from '@angular/core';
import { User, UserService } from '../api-common';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styles: [':host { display: flex;flex-wrap: wrap;width: 100%;']
})
export class WelcomeComponent implements OnInit {
  private currentUser: User;
  
  constructor(private userService: UserService) { }

  ngOnInit() {   
    this.userService.currentUser.subscribe(
      user => { this.currentUser = user; }
    )
  }
}
