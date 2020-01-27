import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { AuthComponent } from './auth/auth.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    AppComponent,
    WelcomeComponent,
    AuthComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: '', component: WelcomeComponent },
      { path: 'register', component: AuthComponent /*,canActivate: [NoAuthGuard] */ },
      { path: 'login', component: AuthComponent /*,canActivate: [NoAuthGuard] */ },
      { path: 'confirm', component: AuthComponent /*,canActivate: [NoAuthGuard] */ },
      { path: '**', component: PageNotFoundComponent }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
