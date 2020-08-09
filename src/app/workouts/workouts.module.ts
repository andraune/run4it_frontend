import { NgModule }       from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WorkoutListComponent } from './list/workout-list.component';
import { WorkoutViewComponent } from './view/workout-view.component';
import { WorkoutsComponent } from './workouts.component';
import { WorkoutsRoutingModule } from './workouts-routing.module';
import { WorkoutListResolver } from './workouts-resolver.service';

import {
    WorkoutCategoryIconPipe,
    WorkoutTimeOfDayStringPipe,
    WorkoutDurationStringPipe,
} from './workouts.pipe';

import { ApiCommonModule } from '../api-common';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';

import { NgxChartsModule }from '@swimlane/ngx-charts';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		WorkoutsRoutingModule,
        ApiCommonModule,
        MatButtonModule,
        MatCardModule,
        MatDividerModule,
        MatExpansionModule,
        MatIconModule,
        MatListModule,
        MatMenuModule,
        MatProgressSpinnerModule,
        MatToolbarModule,
		NgxChartsModule
	],
	declarations: [
        WorkoutsComponent,
        WorkoutListComponent,
        WorkoutViewComponent,
        WorkoutCategoryIconPipe,
        WorkoutTimeOfDayStringPipe,
        WorkoutDurationStringPipe
	],
	providers: [
        WorkoutListResolver,
        WorkoutCategoryIconPipe,
        WorkoutTimeOfDayStringPipe,
        WorkoutDurationStringPipe
	]
})
export class WorkoutsModule {}
