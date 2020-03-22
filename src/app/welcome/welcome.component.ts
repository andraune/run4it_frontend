import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  private backgroundImage = new Image();
  
  constructor() { }

  ngOnInit() {  
    this.backgroundImage.src = '/assets/welcome.jpg'; 
    console.log('Preloaded Welcome background image');
  }
}
