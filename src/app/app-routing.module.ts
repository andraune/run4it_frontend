import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WelcomeComponent } from './welcome/welcome.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { SelectivePreloadingStrategyService } from './selective-preloading-strategy.service';
import { environment } from '../environments/environment';

import { AuthenticatedGuard, NotAuthenticatedGuard } from './api-common';

const appRoutes: Routes = [
    { path: '', component: WelcomeComponent, canActivate: [NotAuthenticatedGuard] },
    { path: 'home', component: HomeComponent, canActivate: [AuthenticatedGuard] },
    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
    imports: [
        RouterModule.forRoot(
            appRoutes,
            {
                enableTracing: environment.enableRouteTracing,
                preloadingStrategy: SelectivePreloadingStrategyService,
            }
        )
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
