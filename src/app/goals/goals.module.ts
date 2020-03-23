import { NgModule }       from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoalsComponent } from './goals.component';
import { GoalsRoutingModule } from './goals-routing.module';
import { ActiveGoalsResolver, FutureGoalsResolver, ExpiredGoalsResolver } from './goals-resolver.service';
import { FormatLabelPipe, ProgressValuePipe, TimeToStartPipe, TimeToEndPipe } from './goals.pipe';
import { ApiCommonModule } from '../api-common';

@NgModule({
	imports: [
		CommonModule,
		GoalsRoutingModule,
		ApiCommonModule
	],
	declarations: [
		GoalsComponent,
		FormatLabelPipe,
		ProgressValuePipe,
		TimeToEndPipe,
		TimeToStartPipe
	],
	providers: [
		ActiveGoalsResolver,
		FutureGoalsResolver,
		ExpiredGoalsResolver
	]
})
export class GoalsModule {}
