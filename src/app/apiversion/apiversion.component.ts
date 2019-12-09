import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-apiversion',
  templateUrl: './apiversion.component.html',
  styleUrls: ['./apiversion.component.css']
})
export class ApiversionComponent implements OnInit {
  version = "v1"

  constructor() { }

  ngOnInit() {
  }

}
