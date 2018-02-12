import { Component, OnInit} from '@angular/core';
import { HttpService} from '../../http.service';
import {Subscription} from "../../models/subscription";
import {SubscriptionService} from "../../services/subscription.service";
import {host} from "../../config";

@Component({
  selector: 'subscription-app',
  templateUrl: 'subscription.component.html',
  styleUrls: ['./subscription.component.css'],
  providers: [SubscriptionService]
})
export class SubscriptionComponent implements OnInit{
  host: string = host;
  done: boolean = true;
  check: boolean = true;
  choose: boolean[] = [true, false, false];
  user_id = localStorage.getItem('user_id');
  subscription: Subscription = new Subscription;
  new_subscription: Subscription = new Subscription;
  constructor(private service: SubscriptionService){}
  ngOnInit(){
    this.new_subscription.type = 1;
    return this.service.getSubscription(host+'payment/?employer_id='+this.user_id+'&limit=1&ordering=-start_date').subscribe(data => {
      this.subscription = data['results'][0];
    });
  }
  submit(){
    console.log('new_sub', this.new_subscription);
    this.service.postSubscription(host+'payment_create/', this.new_subscription, this.user_id).subscribe(data=>{
      this.ngOnInit();
    });
  }
  change_var(variant: number){
    this.choose = [false, false, false];
    this.choose[variant-1] = true;
    this.new_subscription.type = variant;
  }
}
