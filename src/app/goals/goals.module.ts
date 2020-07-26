import { NgModule }       from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoalsComponent } from './goals.component';
import { GoalOverviewComponent } from './overview/goal-overview.component';
import { GoalComponent } from './goal/goal.component';
import { GoalSummaryComponent, GoalDetailsComponent } from './components';
import { GoalCreateComponent } from './new/goal-create.component';
import { GoalsRoutingModule } from './goals-routing.module';
import { ActiveGoalsResolver, FutureGoalsResolver, ExpiredGoalsResolver, GoalCategoriesResolver } from './goals-resolver.service';
import { FormatLabelPipe, ProgressValuePipe, TimeToStartPipe, TimeSinceExpiryPipe, TimeToEndPipe } from './goals.pipe';
import { ApiCommonModule } from '../api-common';

import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxChartsModule }from '@swimlane/ngx-charts';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		GoalsRoutingModule,
		ApiCommonModule,
		MatButtonModule,
		MatDatepickerModule,
		MatIconModule,
		MatInputModule,
		MatListModule,
		MatNativeDateModule,
		MatProgressSpinnerModule,
		MatTableModule,
		MatTabsModule,
		NgxChartsModule
	],
	declarations: [
		GoalsComponent,
		GoalComponent,
		GoalOverviewComponent,
		GoalSummaryComponent,
		GoalDetailsComponent,
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
