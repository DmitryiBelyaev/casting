import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Subscription} from "../models/subscription";


@Injectable()
export class SubscriptionService {
  constructor(private http: HttpClient){}
  getSubscription(url:string){
    return this.http.get(url);
  }

  postSubscription(url: string, data: Subscription, user_id: string){
    const body = {employer_id: user_id, type: data.type};
    return this.http.post(url, body);
  }
}
