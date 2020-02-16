import { NgModule }       from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationComponent }    from './confirmation/confirmation.component';
import { LoginComponent }    from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthRoutingModule } from './auth-routing.module';
import { ApiCommonModule } from '../api-common';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    ApiCommonModule
  ],
  declarations: [
    ConfirmationComponent,
    LoginComponent,
    RegisterComponent
  ]
})
export class AuthModule {}
