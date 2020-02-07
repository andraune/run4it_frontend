import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

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
        ShowAuthenticatedDirective
    ],
    exports: [
        ShowAuthenticatedDirective
    ]
})
export class ApiCommonModule {}
