import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { FooterComponent, HeaderComponent, NotificationComponent } from './components';
import { AuthenticatedGuard, NotAuthenticatedGuard} from './guards';
import { ErrorInterceptor, JsonHeaderInterceptor, AuthInterceptor } from './interceptors';
import { ApiService, JwtService, UserService } from './services';
import { ShowAuthenticatedDirective } from './show-authenticated.directive';

@NgModule({
    imports: [],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: JsonHeaderInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        ApiService,
        JwtService,
        UserService,
        AuthenticatedGuard,
        NotAuthenticatedGuard
    ],
    declarations: [
        FooterComponent,
        HeaderComponent,
        ShowAuthenticatedDirective
    ],
    exports: [
        FooterComponent,
        HeaderComponent,
    ]
})
export class ApiCommonModule {}
