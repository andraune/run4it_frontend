import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { WelcomeComponent } from './welcome/welcome.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { environment } from '../environments/environment';

import { AuthenticatedGuard, NotAuthenticatedGuard } from './api-common';

const appRoutes: Routes = [
    { path: '', component: WelcomeComponent, canActivate: [NotAuthenticatedGuard] },
    { path: 'dashboard', component: HomeComponent, canActivate: [AuthenticatedGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthenticatedGuard] },
    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
    imports: [
        RouterModule.forRoot(
            appRoutes,
            {
                enableTracing: environment.enableRouteTracing,
                preloadingStrategy: PreloadAllModules,
            }
        )
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
