import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WelcomeComponent } from './welcome/welcome.component'; 
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { SelectivePreloadingStrategyService } from './selective-preloading-strategy.service';
import { environment } from '../environments/environment';

const appRoutes: Routes = [
    { path: '', component: WelcomeComponent },
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
