import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GoalViewComponent } from './view/goal-view.component';
import { GoalCreateComponent } from './new/goal-create.component';

import { ActiveGoalsResolver, FutureGoalsResolver, ExpiredGoalsResolver, GoalCategoriesResolver } from './goals-resolver.service';
import { AuthenticatedGuard } from '../api-common';
import { GoalsComponent } from './goals.component';

const goalRoutes: Routes = [
  {
    path: 'goals',
    component: GoalsComponent,
    canActivate: [AuthenticatedGuard],
    resolve: { active: ActiveGoalsResolver, future: FutureGoalsResolver, expired: ExpiredGoalsResolver, categories: GoalCategoriesResolver },
    children: [
      {
        path: '',
        redirectTo: 'view',
        pathMatch: 'full'
      },
      {
        path: 'view',
        component: GoalViewComponent
      },
      {
        path: 'new',
        component: GoalCreateComponent
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


