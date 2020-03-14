import { NgModule }       from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthComponent } from './auth.component';
import { ConfirmationComponent }    from './confirmation/confirmation.component';
import { LoginComponent }    from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthRoutingModule } from './auth-routing.module';
import { ApiCommonModule } from '../api-common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    ApiCommonModule
  ],
  declarations: [
    AuthComponent,
    ConfirmationComponent,
    LoginComponent,
    RegisterComponent
  ]
})
export class AuthModule {}
