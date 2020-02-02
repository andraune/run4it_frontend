import { Injectable } from '@angular/core';

@Injectable()
export class JwtService {

    getAccessToken(): String {
        return window.localStorage['jwtAccessToken'];
    }

    getRefreshToken(): String {
        return window.localStorage['jwtRefreshToken'];
    }

    saveAccessToken(token: String) {
        window.localStorage['jwtAccessToken'] = token;
    }

    saveRefreshToken(token: String) {
        window.localStorage['jwtRefreshToken'] = token;
    }

    destroyAccessToken() {
        window.localStorage.removeItem('jwtAccessToken');
    }

    destroyRefreshToken() {
        window.localStorage.removeItem('jwtRefreshToken');
    }
}
