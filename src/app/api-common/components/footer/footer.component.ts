import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from "../../services";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit, OnDestroy {

  public apiVersion: number;
  public isWelcomePage: boolean = false;

  private subscriptions: Subscription[] = [];
  private welcomeUrl = "/";

  constructor(private router: Router, private apiService: ApiService) {
  }

  ngOnInit() {
    this.subscriptions.push(
      this.router.events.subscribe(
        (event: Event) => {
            if (event instanceof NavigationEnd) {
                this.isWelcomePage = (event.url == this.welcomeUrl);
            }
        }
      )
    );

    this.subscriptions.push(
      this.apiService.get("/").subscribe(
        apiData => this.apiVersion = apiData.version,
        error => this.apiVersion = 0
      )
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
