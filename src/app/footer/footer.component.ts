import { Component, OnInit } from '@angular/core';
import { map, tap } from 'rxjs/operators';

import { ApiService } from "../api-common";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styles: [':host { display: flex;flex-wrap: wrap;width: 100%;']
})
export class FooterComponent implements OnInit {

  apiVersion: number;

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    this.apiService.get("/").subscribe(
      apiData => this.apiVersion = apiData.version,
      err => this.apiVersion = 0);
  }

}
