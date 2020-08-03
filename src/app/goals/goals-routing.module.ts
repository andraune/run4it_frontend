import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GoalOverviewComponent } from './overview/goal-overview.component';
import { GoalCreateComponent } from './new/goal-create.component';
import { GoalComponent } from './goal/goal.component';

import { ActiveGoalsResolver, FutureGoalsResolver, ExpiredGoalsResolver } from './goals-resolver.service';
import { ProfileResolver } from '../profile/profile-resolver.service';
import { AuthenticatedGuard } from '../api-common';
import { GoalsComponent } from './goals.component';

const goalRoutes: Routes = [
  {
    path: 'goals',
    component: GoalsComponent,
    canActivate: [AuthenticatedGuard],
    resolve: { active: ActiveGoalsResolver, future: FutureGoalsResolver, expired: ExpiredGoalsResolver, profile: ProfileResolver },
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full'
      },
      {
        path: 'overview',
        component: GoalOverviewComponent
      },
      {
        path: 'new',
        component: GoalCreateComponent
      },
      {
        path: ':id',
        component: GoalComponent
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
export class GoalsRoutingModule {}
