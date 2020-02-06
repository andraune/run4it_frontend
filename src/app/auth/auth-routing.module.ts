import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent }       from './login/login.component';
import { NotAuthenticatedGuard } from '../api-common';

const authRoutes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [NotAuthenticatedGuard] }
];

@NgModule({
  imports: [
    RouterModule.forChild(authRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AuthRoutingModule {}
