import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-goal',
  templateUrl: './goal.component.html',
  styleUrls: ['../goals.component.css']
})
export class GoalComponent implements OnInit, OnDestroy {
    public goalID: number = 0;
    private routeSubscription: Subscription = null;

    constructor(private route: ActivatedRoute) {}

    ngOnInit() {
      this.routeSubscription = this.route.params.subscribe(params => {
        var idAsNumber = +params['id'];
        
        if (!isNaN(idAsNumber)) {
          this.goalID = idAsNumber;
        }
      });
    }

    ngOnDestroy() {
      if (this.routeSubscription) {
        this.routeSubscription.unsubscribe();
      }
    }
}
