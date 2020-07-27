import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User, AuthenticationService, NotificationService } from '../../api-common';


@Component({
  selector: 'app-goal-create',
  templateUrl: './goal-create.component.html',
  styleUrls: ['../goals.component.css']
})
export class GoalCreateComponent implements OnInit {

    public goalForm: FormGroup;
    public isSubmitting = false;

    private currentUser: User; 



    constructor(
        private authService: AuthenticationService,
        private notificationService: NotificationService,
        private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.authService.authenticatedUser$.subscribe(
            (userData: User) => this.currentUser = userData
        );

        this.goalForm = this.formBuilder.group({
            'categoryID': ['', Validators.compose([Validators.required, Validators.min(1)])],
          });
    }
}
