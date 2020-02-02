import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styles: [':host { display: flex;flex-wrap: wrap;width: 100%;']
})
export class WelcomeComponent implements OnInit {
  
  constructor() { }

  envMode: string

  ngOnInit() {
    this.envMode = (environment.production ? "Production" : "Development");
  }

}
