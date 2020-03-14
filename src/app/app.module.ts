import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { GoalsComponent } from './goals/goals.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { AppRoutingModule } from './app-routing.module';
import { ApiCommonModule} from './api-common/api-common.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';

import { GoalResolver } from './goals/goal-resolver.service';
import { FormatLabelPipe, ProgressValuePipe, TimeToStartPipe, TimeToEndPipe } from './goals/goals.pipe';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    ApiCommonModule,
    AuthModule,
    ProfileModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    WelcomeComponent,
    HomeComponent,
    GoalsComponent,
    PageNotFoundComponent,
    FormatLabelPipe,
    ProgressValuePipe,
    TimeToEndPipe,
    TimeToStartPipe
  ],
  providers: [ GoalResolver ],
  bootstrap: [AppComponent]
})
export class AppModule { }
