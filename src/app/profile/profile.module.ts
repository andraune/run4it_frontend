import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileResolver } from './profile-resolver.service';
import { ApiCommonModule } from '../api-common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProfileRoutingModule,
    ApiCommonModule
  ],
  declarations: [
    ProfileComponent
  ],
  providers: [ ProfileResolver ]
})
export class ProfileModule {}
