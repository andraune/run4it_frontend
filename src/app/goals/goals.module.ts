import { NgModule }       from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoalsComponent } from './goals.component';
import { GoalOverviewComponent } from './overview/goal-overview.component';
import { GoalComponent } from './goal/goal.component';
import { GoalSummaryComponent, GoalDetailsComponent, GoalChartComponent } from './components';
import { GoalCreateComponent } from './new/goal-create.component';
import { GoalsRoutingModule } from './goals-routing.module';
import { ActiveGoalsResolver, FutureGoalsResolver, ExpiredGoalsResolver } from './goals-resolver.service';

import {
	GoalTimeToStartPipe,
	GoalTimeToEndPipe,
	GoalTimeSinceExpiryPipe,
	GoalHeadingPipe,
	GoalStatementPipe,
	GoalProgressPercentagePipe,
	GoalCategoryIconPipe,
	GoalTargetFormattedPipe,
	GoalDaysLeftPipe
} from './goals.pipe';

import { ApiCommonModule } from '../api-common';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper'; 
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxChartsModule }from '@swimlane/ngx-charts';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		GoalsRoutingModule,
		ApiCommonModule,
		MatButtonModule,
		MatCardModule,
		MatDatepickerModule,
        MatDividerModule,
        MatExpansionModule,
		MatIconModule,
		MatInputModule,
		MatListModule,
		MatNativeDateModule,
		MatProgressSpinnerModule,
		MatStepperModule,
		MatSelectModule,
		MatTableModule,
		MatTabsModule,
		MatTooltipModule,
		NgxChartsModule
	],
	declarations: [
		GoalsComponent,
		GoalComponent,
		GoalOverviewComponent,
		GoalSummaryComponent,
		GoalDetailsComponent,
		GoalChartComponent,
		GoalCreateComponent,
		GoalTimeSinceExpiryPipe,
		GoalTimeToEndPipe,
		GoalTimeToStartPipe,
		GoalHeadingPipe,
		GoalStatementPipe,
		GoalProgressPercentagePipe,
		GoalCategoryIconPipe,
		GoalTargetFormattedPipe,
		GoalDaysLeftPipe
	],
	providers: [
		ActiveGoalsResolver,
		FutureGoalsResolver,
		ExpiredGoalsResolver
	]
})
export class GoalsModule {}
