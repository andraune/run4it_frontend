import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-goal',
  templateUrl: './goal.component.html',
  styleUrls: ['../goals.component.css']
})
export class GoalComponent implements OnInit {
    public goalID: number = 0;

    constructor(private route: ActivatedRoute) {
        route.params.subscribe(params => {
        var idAsNumber = +params['id'];
        
        if (!isNaN(idAsNumber)) {
          this.goalID = idAsNumber;
        }
      });
    }

    ngOnInit() {}
}
