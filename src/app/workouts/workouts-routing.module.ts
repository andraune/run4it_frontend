import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProfileResolver } from '../profile/profile-resolver.service';
import { AuthenticatedGuard } from '../api-common';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { WorkoutViewComponent } from './view/workout-view.component';
import { WorkoutsComponent } from './workouts.component';
import { WorkoutListResolver } from './workouts-resolver.service';

const goalRoutes: Routes = [
  {
    path: 'workouts',
    component: WorkoutsComponent,
    canActivate: [AuthenticatedGuard],
    resolve: { workouts: WorkoutListResolver, profile: ProfileResolver },
    children: [
      {
        path: '',
        redirectTo: 'latest',
        pathMatch: 'full'
      },
      {
        path: 'latest',
        component: WorkoutViewComponent
      },
      {
        path: ':id',
        component: WorkoutViewComponent
      },
      {
          path: '**',
          component: PageNotFoundComponent
      }
    ]
  }  
];

@NgModule({
  imports: [
    RouterModule.forChild(goalRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class WorkoutsRoutingModule {}
