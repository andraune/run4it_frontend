import { NgModule } from '@angular/core';

import {
    ApiService,
    JwtService
} from './services';

@NgModule({
    imports: [],
    providers: [
        ApiService,
        JwtService
    ],
    declarations: []
})
export class ApiCommonModule {}
