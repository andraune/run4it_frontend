import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { UserService } from '../../api-common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [':host { display: flex;width: 100%;']
})
export class LoginComponent implements OnInit {
  private loginForm: FormGroup;
  private isSubmitting = false;
  private loginResponse: String;


  constructor(
    //private route: ActivatedRoute,
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
            this.loginResponse = err.statusText;
          }
        );
    }
    else {
      this.loginResponse = 'Invalid:';

      for (const name in controls) {
        if (controls[name].invalid) {
          this.loginResponse = this.loginResponse.concat(' ' , name);
        }
      }
    }
  }

}
