import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { NotAuthenticatedGuard } from '../api-common';

const authRoutes: Routes = [
  { path: 'confirmation', component: ConfirmationComponent, canActivate: [NotAuthenticatedGuard] },
  { path: 'login', component: LoginComponent, canActivate: [NotAuthenticatedGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [NotAuthenticatedGuard] }
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
