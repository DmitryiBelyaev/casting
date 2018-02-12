import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';


@Injectable()
export class NotificationService{
  constructor(private http: HttpClient){ }

  getNotifications(url: string){
    return this.http.get(url);
  }
  deleteNotification(url: string){
    return this.http.delete(url);
  }
}
