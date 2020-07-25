import { NgModule }       from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoalsComponent } from './goals.component';
import { GoalViewComponent } from './view/goal-view.component';
import { GoalCreateComponent } from './new/goal-create.component';
import { GoalsRoutingModule } from './goals-routing.module';
import { ActiveGoalsResolver, FutureGoalsResolver, ExpiredGoalsResolver, GoalCategoriesResolver } from './goals-resolver.service';
import { FormatLabelPipe, ProgressValuePipe, TimeToStartPipe, TimeSinceExpiryPipe, TimeToEndPipe } from './goals.pipe';
import { ApiCommonModule } from '../api-common';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		GoalsRoutingModule,
		ApiCommonModule
	],
	declarations: [
		GoalsComponent,
		GoalViewComponent,
		GoalCreateComponent,
		FormatLabelPipe,
		ProgressValuePipe,
		TimeSinceExpiryPipe,
		TimeToEndPipe,
		TimeToStartPipe
	],
	providers: [
		ActiveGoalsResolver,
		FutureGoalsResolver,
		ExpiredGoalsResolver,
		GoalCategoriesResolver
	]
})
export class GoalsModule {}
