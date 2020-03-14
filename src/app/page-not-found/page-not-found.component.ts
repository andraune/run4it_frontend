import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styles: [
    ':host { display: flex; width: 100%; }',
    'div.ooops { width:100%; text-align:center; margin-top:50px; }'
  ]
})
export class PageNotFoundComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
