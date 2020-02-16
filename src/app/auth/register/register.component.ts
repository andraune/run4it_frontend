import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { NotificationService, UserService } from '../../api-common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../auth.component.css']
})
export class RegisterComponent implements OnInit {
  private registerForm: FormGroup;
  private isSubmitting = false;


  constructor(
    private notificationService: NotificationService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      'username': ['', Validators.compose([Validators.required, Validators.minLength(4),Validators.maxLength(16)])],
      'email': ['', Validators.compose([Validators.required, Validators.email])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(32)])],
      'confirm_password': ['', Validators.required]
    });
  }

  ngOnInit() {}

  submitForm() {
    const controls = this.registerForm.controls;
    const passwordsMatch = (controls.password.value === controls.confirm_password.value);
    const canSubmit = ((!this.registerForm.invalid) && passwordsMatch);

    this.notificationService.clearAll();

    if (canSubmit) {   
      this.isSubmitting = true;
      this.userService.register(controls.username.value, controls.email.value, controls.password.value)
        .pipe(first())
        .subscribe(
          data => {
            this.notificationService.addInfo(0, 'New user', `User '${data.username}'  has been registered. Check email for verification code.`, true);
            this.router.navigate(['/confirmation'], { queryParams: {username: data.username}});           
          },
          err => {
            this.isSubmitting = false;

            for (const name in controls) {
              controls[name].reset();
            }
          }
        );
    }
    else {
      for (const name in controls) {
        if (controls[name].invalid) {
          this.notificationService.addError(0, '', `Invalid value provided for '${name}'.`);
        }
      }
      if (!passwordsMatch) {
        this.notificationService.addError(0, '', "Passwords doesn't match.");
      }
    }
  }
}
