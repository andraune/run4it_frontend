import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { ErrorInterceptor, JsonHeaderInterceptor, AuthInterceptor } from './interceptors';
import { ApiService, JwtService, UserService } from './services';

@NgModule({
    imports: [],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: JsonHeaderInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        ApiService,
        JwtService,
        UserService
    ],
    declarations: []
})
export class ApiCommonModule {}
