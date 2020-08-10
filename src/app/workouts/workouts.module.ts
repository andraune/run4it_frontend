import { NgModule }       from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WorkoutListComponent } from './list/workout-list.component';
import { WorkoutViewComponent } from './view/workout-view.component';
import { WorkoutCreateComponent} from './new/workout-create.component';
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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
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
        MatDatepickerModule,
        MatDividerModule,
        MatExpansionModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatNativeDateModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatSelectModule,
        MatStepperModule,
        MatToolbarModule,
		NgxChartsModule
	],
	declarations: [
        WorkoutsComponent,
        WorkoutListComponent,
        WorkoutViewComponent,
        WorkoutCreateComponent,
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
