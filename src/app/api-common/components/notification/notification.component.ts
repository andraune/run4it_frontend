import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { NotificationService } from '../../services';


@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, OnDestroy {
    private msgListener: Subscription;
    private errListener: Subscription;
    public messages = [];
    public errors = [];

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

    clearMessages() {
        this.notificationService.clearInfoList();
    }

    clearErrors() {
        this.notificationService.clearErrorList();
    }
}
