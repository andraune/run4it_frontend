import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './api-common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthenticationService) {}

  ngOnInit() {
    this.authService.populate();
  }

}
