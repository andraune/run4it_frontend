import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { AuthComponent } from './auth/auth.component';


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    AppComponent,
    WelcomeComponent,
    AuthComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: '', component: WelcomeComponent },
      { path: 'register', component: AuthComponent /*,canActivate: [NoAuthGuard] */ },
      { path: 'login', component: AuthComponent /*,canActivate: [NoAuthGuard] */ },
      { path: 'confirm', component: AuthComponent /*,canActivate: [NoAuthGuard] */ }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
