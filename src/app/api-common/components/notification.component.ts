import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Notification } from '../models';
import { NotificationService } from '../services';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';


@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, OnDestroy {
    private msgListener: Subscription;
    private errListener: Subscription;
    private messages = [];
    private errors = [];

    constructor(private notificationService: NotificationService) {}

    ngOnInit() {
        this.msgListener = this.notificationService.getInfoList()
            .subscribe((list) => this.messages = list);

        this.errListener = this.notificationService.getErrorList()
            .subscribe((list) => this.errors = list);
    }

    ngOnDestroy() {
        this.msgListener.unsubscribe();
        this.errListener.unsubscribe();
    }
}
