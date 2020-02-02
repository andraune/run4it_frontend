import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import { ActivatedRoute } from '@angular/router';

import { JwtService } from '../../api-common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [':host { display: flex;width: 100%;']
})
export class LoginComponent implements OnInit {
  accessToken: String;
  refreshToken: String;
  loginForm: FormGroup;
  isSubmitting = false;

  constructor(
    //private route: ActivatedRoute,
    private jwtService: JwtService,
    private formBuilder: FormBuilder
  ) {
    this.loginForm = this.formBuilder.group({
      'email': ['', Validators.required],
      'password': ['', Validators.required]
    });
  }

  ngOnInit() {
    var at = this.jwtService.getAccessToken();
    var rt = this.jwtService.getRefreshToken();
    this.accessToken = at ? at : "<not set>";
    this.refreshToken = rt ? rt : "<not set>";
  }

  submitForm() {
    this.isSubmitting = true;
    // send login request
    this.isSubmitting = false;    
  }

}
