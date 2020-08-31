import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './profile.component';
import { WeightHistoryComponent, ProfilePreferencesComponent } from './components';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileResolver } from './profile-resolver.service';
import { ApiCommonModule } from '../api-common';

import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
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
    ProfileRoutingModule,
    ApiCommonModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDividerModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatTabsModule,
    NgxChartsModule
  ],
  declarations: [
    ProfileComponent,
    WeightHistoryComponent,
    ProfilePreferencesComponent
  ],
  providers: [ ProfileResolver ]
})
export class ProfileModule {}
