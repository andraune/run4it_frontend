import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { NotificationService, AuthenticationService } from '../../api-common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../auth.component.css']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public isSubmitting = false;


  constructor(
    private notificationService: NotificationService,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      'email': ['', Validators.compose([Validators.required, Validators.email])],
      'password': ['', Validators.required]
    });
  }

  submitForm() {
    this.notificationService.clearAll();
    const canSubmit = !this.loginForm.invalid;
    const controls = this.loginForm.controls;

    if (canSubmit) {   
      this.isSubmitting = true;
      this.authService.login(controls.email.value, controls.password.value)
        .pipe(first())
        .subscribe(
          data => {
            this.router.navigate(['/dashboard']);           
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
