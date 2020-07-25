import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../services";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  apiVersion: number;

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    this.apiService.get("/").subscribe(
      apiData => this.apiVersion = apiData.version,
      error => this.apiVersion = 0);
  }
}
