import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-goal-details',
  templateUrl: './goal-details.component.html',
  styleUrls: ['../goals.component.css']
})
export class GoalDetailsComponent implements OnInit {
    @Input() id: number = 0;

    constructor() {
    }

    ngOnInit() {
        if (isNaN(this.id)) {
            this.id = 0;
        }
    }

}
