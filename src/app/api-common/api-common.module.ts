import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FooterComponent, HeaderComponent, NotificationComponent } from './components';
import { AuthenticatedGuard, NotAuthenticatedGuard} from './guards';
import { ErrorInterceptor, JsonHeaderInterceptor, AuthInterceptor } from './interceptors';

import {
    ApiService,
    GoalService,
    JwtService,
    NotificationService,
    ProfileService,
    UserService,
    AuthenticationService
} from './services';

import { ShowAuthenticatedDirective } from './show-authenticated.directive';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatToolbarModule,
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: JsonHeaderInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        ApiService,
        GoalService,
        JwtService,
        NotificationService,
        ProfileService,
        UserService,
        AuthenticationService,
        AuthenticatedGuard,
        NotAuthenticatedGuard
    ],
    declarations: [
        FooterComponent,
        HeaderComponent,
        NotificationComponent,
        ShowAuthenticatedDirective
    ],
    exports: [
        FooterComponent,
        HeaderComponent,
        NotificationComponent,
        ShowAuthenticatedDirective,
        RouterModule
    ]
})
export class ApiCommonModule {}
