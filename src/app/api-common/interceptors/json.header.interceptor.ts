import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JsonHeaderInterceptor implements HttpInterceptor {
    constructor() {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        if (!request.url.match(/\/workouts\/gpx\//)) {
            const jsonHeaders = {
                'Content-Type': 'application/json',
                'Accept': 'application/json'            
            };
    
            return next.handle(request.clone({ setHeaders: jsonHeaders }));            
        }

        return next.handle(request);
    }
}
