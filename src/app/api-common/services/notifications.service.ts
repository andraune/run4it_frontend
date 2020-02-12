import { Injectable} from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { Notification } from '../models';

@Injectable({ providedIn: 'root' })
export class NotificationService {
    private messages = [];
    private errors = [];
    private messagesSubject = new Subject<any>();
    private errorsSubject = new Subject<any>();

    constructor() {}

    getInfoList(): Observable<any> {
        return this.messagesSubject.asObservable();
    }

    getErrorList(): Observable<any> {
        return this.errorsSubject.asObservable();
    }

    addInfo(code: number, subject: string, message: string) {
        this.messages.push(this._createNotification(code, subject,message));
        this.messagesSubject.next(this.messages);
    }

    addError(code: number, subject: string, message: string) {
        this.errors.push(this._createNotification(code, subject,message));
        this.errorsSubject.next(this.errors);
    }

    clearInfoList() {
        this.messages = [];
        this.messagesSubject.next(this.messages);
    }

    clearErrorList() {
        this.errors = [];
        this.errorsSubject.next(this.messages);
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
