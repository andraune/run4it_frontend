import { Injectable } from '@angular/core';
import * as jwtDecode from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class JwtService {

    getAccessToken(): string {
        return window.localStorage['jwtAccessToken'];
    }

    getRefreshToken(): string {
        return window.localStorage['jwtRefreshToken'];
    }

    saveAccessToken(token: string) {
        window.localStorage['jwtAccessToken'] = token;
    }

    saveRefreshToken(token: string) {
        window.localStorage['jwtRefreshToken'] = token;
    }

    destroyAccessToken() {
        window.localStorage.removeItem('jwtAccessToken');
    }

    destroyRefreshToken() {
        window.localStorage.removeItem('jwtRefreshToken');
    }

    isTokenExpiring(token:string, limitSeconds:number): boolean {
        var isExpiring = false;
        
        if (token) {
            var decodedToken = jwtDecode(token);

            if (decodedToken) {
                var currentTimestamp = Math.round((new Date()).getTime() / 1000);
                var timeDelta = decodedToken.exp - (currentTimestamp + limitSeconds);
                isExpiring = (timeDelta < 0);
            }            
        }

        return isExpiring;
    }

    isTokenExpired(token:string): boolean {
        return this.isTokenExpiring(token, 0);
    }
}
