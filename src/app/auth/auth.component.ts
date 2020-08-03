import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';

@Component({
  selector: 'auth-root',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
    public showNewUserLink = false;
    public showExistingUserLink = false;
    public showConfirmedLink = false;
    private confirmationUrl = "/auth/confirmation";
    private registerUrl = "/auth/register";
    private loginUrl = "/auth/login";

    constructor(private router: Router) {
        router.events.subscribe(
            (event: Event) => {
                if (event instanceof NavigationEnd) {
                    this.showNewUserLink = (event.url == this.confirmationUrl || event.url == this.loginUrl);
                    this.showExistingUserLink = (event.url == this.registerUrl);
                    this.showConfirmedLink = (event.url == this.confirmationUrl);
                }
            }
        );
    }
    
    ngOnInit() {}
}
