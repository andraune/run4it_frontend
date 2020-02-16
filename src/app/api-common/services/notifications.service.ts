import { Injectable} from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

import { Notification } from '../models';

@Injectable({ providedIn: 'root' })
export class NotificationService {
    private messages = [];
    private errors = [];
    private messagesSubject = new BehaviorSubject<any>([]);
    private errorsSubject = new BehaviorSubject<any>([]);
    private keepAfterRouteChange = false;

    constructor(private router: Router) {
        this.router.events.subscribe(
            event => {
                if (event instanceof NavigationStart) {
                    if (this.keepAfterRouteChange) {
                        this.keepAfterRouteChange = false;
                    }
                    else {
                        this.clearAll();
                    }
                }
            }
        )
    }

    getInfoList(): Observable<any> {
        return this.messagesSubject.asObservable();
    }

    getErrorList(): Observable<any> {
        return this.errorsSubject.asObservable();
    }

    addInfo(code: number, subject: string, message: string, keepOnRouteChange = false) {
        this.keepAfterRouteChange = keepOnRouteChange;
        this.messages.push(this._createNotification(code, subject,message));
        this.messagesSubject.next(this.messages);
    }

    addError(code: number, subject: string, message: string, keepOnRouteChange = false) {
        this.keepAfterRouteChange = keepOnRouteChange;
        this.errors.push(this._createNotification(code, subject,message));
        this.errorsSubject.next(this.errors);
    }

    clearInfoList() {
        this.messages = [];
        this.messagesSubject.next(this.messages);
    }

    clearErrorList() {
        this.errors = [];
        this.errorsSubject.next(this.errors);
    }

    clearAll() {
        this.clearInfoList();
        this.clearErrorList();
    }

    _createNotification(code: number, subject: string, message: string): Notification {
        var notification = {} as Notification;
        notification.code = code;
        notification.subject = subject;
        notification.text = message;
        return notification;
    }
}
