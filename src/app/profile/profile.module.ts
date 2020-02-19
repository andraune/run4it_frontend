import { NgModule }       from '@angular/core';
import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileResolver } from './profile-resolver.service';
import { ApiCommonModule } from '../api-common';

@NgModule({
  imports: [
    ProfileRoutingModule,
    ApiCommonModule
  ],
  declarations: [
    ProfileComponent
  ],
  providers: [ ProfileResolver ]
})
export class ProfileModule {}
