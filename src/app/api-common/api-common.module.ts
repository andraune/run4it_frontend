import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { FooterComponent, HeaderComponent, NotificationComponent } from './components';
import { AuthenticatedGuard, NotAuthenticatedGuard} from './guards';
import { ErrorInterceptor, JsonHeaderInterceptor, AuthInterceptor } from './interceptors';

import {
    ApiService,
    JwtService,
    NotificationService,
    ProfileService,
    UserService
} from './services';

import { ShowAuthenticatedDirective } from './show-authenticated.directive';

@NgModule({
    imports: [
        CommonModule,
        RouterModule
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: JsonHeaderInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        ApiService,
        JwtService,
        NotificationService,
        ProfileService,
        UserService,
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
