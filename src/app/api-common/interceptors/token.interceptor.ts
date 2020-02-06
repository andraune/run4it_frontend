import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { JwtService } from '../services';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private tokenRefreshInProgress = false;

    constructor(private jwtService: JwtService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        request = this.addBearerToken(request); 
        return next.handle(request)
    }

    addBearerToken(request: HttpRequest<any>) : HttpRequest<any> {     
        var token: String;
    
        if (request.url.match(/\/users\/loginRefresh$/) || request.url.match(/\/users\/logoutRefresh$/)) {
            console.log(`Adding refresh-token for url ${request.url}`);
            token = this.jwtService.getRefreshToken();
        }
        else if (request.url.match(/\/users\/login$/) || request.url.match(/\/users\/loginFresh$/)) {
            token = null;
        }
        else {
            token = this.jwtService.getAccessToken();            
        }

        if (token) {
            const bearerHeader = { Authorization: `Bearer ${token}` };
            request = request.clone({ setHeaders: bearerHeader });
        }

        return request;        
    }
}
