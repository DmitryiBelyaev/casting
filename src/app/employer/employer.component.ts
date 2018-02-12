import { Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {EmployerProfileService} from "../services/employer-profile.service";
import {host} from "../config";
import {Employer} from "../models/employer";
import {Subscription} from "../models/subscription";
import {SubscriptionService} from "../services/subscription.service";

@Component({
    selector: 'employer-app',
    templateUrl: './employer.component.html',
    providers: [EmployerProfileService, SubscriptionService],
    styleUrls: ['./employer.component.css']
})
export class EmployerComponent implements OnInit{
    host = host;
    visibility: boolean = false;
    check: boolean = true;
    employer: Employer = new Employer;
    subscription: Subscription = new Subscription;
    // toggle: boolean = false;
    switchfunc(event:any){
        if (event.check == true) {
            this.check = true;
        }
        else {
            this.check = false;
        }
    }
    constructor(private employerService: EmployerProfileService,
                private service: SubscriptionService,){}

    ngOnInit(){
        this.getEmployer();
    }
    getEmployer(){
      let user_id:string = localStorage.getItem('user_id');
      this.employerService.getCreator(host+'employer/'+user_id+'/').subscribe((data:Employer) => this.employer=data);
      return this.service.getSubscription(host+'payment/?employer__id='+user_id+'&limit=1&ordering=-start_date').subscribe((data: Subscription) => {
        this.subscription = data['results'][0];
      });
    }
    // toggleSwitch(){
  //   this.toggle = !this.toggle;
  // }
  Guard_log_out() {
    this.visibility = !this.visibility;
  }
}
