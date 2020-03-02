import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { ProfileResolver } from './profile-resolver.service';
import { AuthenticatedGuard } from '../api-common';

const profileRoutes: Routes = [
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthenticatedGuard],
    resolve: { profile: ProfileResolver }
  }
];

@NgModule({
  imports: [ RouterModule.forChild(profileRoutes)],
  exports: [ RouterModule ]
})
export class ProfileRoutingModule {}
