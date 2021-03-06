import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProfileResolver } from '../profile/profile-resolver.service';
import { AuthenticatedGuard } from '../api-common';
import { WorkoutViewComponent } from './view/workout-view.component';
import { WorkoutCreateComponent } from './new/workout-create.component';
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
            path: 'new',
            component: WorkoutCreateComponent
        },
        {
            path: ':id',
            component: WorkoutViewComponent
        },
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
