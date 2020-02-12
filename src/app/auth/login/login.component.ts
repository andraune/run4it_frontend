import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { NotificationService, UserService } from '../../api-common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [':host { display: flex;width: 100%;']
})
export class LoginComponent implements OnInit {
  private loginForm: FormGroup;
  private isSubmitting = false;


  constructor(
    private notificationService: NotificationService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      'email': ['', Validators.compose([Validators.required, Validators.email])],
      'password': ['', Validators.required]
    });
  }

  ngOnInit() {}

  submitForm() {
    const canSubmit = !this.loginForm.invalid;
    const controls = this.loginForm.controls;
    this.notificationService.clearAll();

    if (canSubmit) {   
      this.isSubmitting = true;
      this.userService.login(controls.email.value, controls.password.value)
        .pipe(first())
        .subscribe(
          data => {
            this.router.navigateByUrl("/");           
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
    }
  }

}
