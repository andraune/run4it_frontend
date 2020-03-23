import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GoalsComponent } from './goals.component';

import { ActiveGoalsResolver, FutureGoalsResolver, ExpiredGoalsResolver } from './goals-resolver.service';
import { AuthenticatedGuard } from '../api-common';

const goalRoutes: Routes = [
  {
    path: 'goals',
    canActivate: [AuthenticatedGuard],
    resolve: { active: ActiveGoalsResolver, future: FutureGoalsResolver, expired: ExpiredGoalsResolver },
    children: [
      {
        path: '',
        component: GoalsComponent
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
export class GoalsRoutingModule {}


