import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { WelcomeComponent } from './welcome/welcome.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { AuthenticatedGuard, NotAuthenticatedGuard } from './api-common';
import { environment } from '../environments/environment';

const appRoutes: Routes = [
    { path: '', component: WelcomeComponent, canActivate: [NotAuthenticatedGuard] },
    { path: 'dashboard', component: HomeComponent, canActivate: [AuthenticatedGuard] },
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
