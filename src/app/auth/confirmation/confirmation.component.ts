import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { NotificationService, UserService } from '../../api-common';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['../auth.component.css']
})
export class ConfirmationComponent implements OnInit {
  public confirmationForm: FormGroup;
  public isSubmitting = false;

  constructor(
    private notificationService: NotificationService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.confirmationForm = this.formBuilder.group({
      'username': ['', Validators.required],
      'confirmationCode': ['', Validators.required]
    });
    
    this.confirmationForm.controls.username.setValue(this.route.snapshot.queryParamMap.get("username"));
    this.confirmationForm.controls.confirmationCode.setValue(this.route.snapshot.queryParamMap.get("code"));
  }

  submitForm() {
    const canSubmit = !this.confirmationForm.invalid;
    const controls = this.confirmationForm.controls;
    this.notificationService.clearAll();

    if (canSubmit) {   
      this.isSubmitting = true;
      this.userService.confirm(controls.username.value, controls.confirmationCode.value)
        .pipe(first())
        .subscribe(
          data => {
            this.notificationService.addInfo(0, 'Confirmed user', `User '${data.username}'  confirmed.`, true)
            this.router.navigate(['/login']);           
          },
          err => {
            this.isSubmitting = false;
            controls.confirmationCode.reset();
          }
        );
    }
    else {
      for (const name in controls) {
        if (controls[name].invalid) {
          this.notificationService.addError(0, '', `Invalid value provided for '${name}'.`);
        }
      }
    }
  }

}
