import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [':host { display: flex;flex-wrap: wrap;width: 100%;']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
