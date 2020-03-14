import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';

import { ConfirmationComponent } from './confirmation/confirmation.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { NotAuthenticatedGuard } from '../api-common';

const authRoutes: Routes = [
  {
    path: 'auth',
    component: AuthComponent, // TODO: Resolve isAuthenticated / AuthUser
    canActivate: [NotAuthenticatedGuard],
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'confirmation',
        component: ConfirmationComponent
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      }
    ]
  }  
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
