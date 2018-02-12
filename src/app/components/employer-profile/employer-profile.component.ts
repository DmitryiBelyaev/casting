import {Component, OnInit} from "@angular/core";
import {Employer} from "../../models/employer";
import {EmployerProfileService} from "../../services/employer-profile.service";
import {host} from "../../config";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "../../models/subscription";
import {SubscriptionService} from "../../services/subscription.service";
import {EmployerUpdate} from "../../models/employerUpdate";
import {isUndefined} from "util";
import {HttpService} from "../../http.service";
import {EmployerComponent} from "../../employer/employer.component";

@Component({
    selector: 'employer-profile-app',
    templateUrl: './employer-profile.component.html',
    styleUrls: ['./employer-profile.component.css'],
    providers: [EmployerProfileService, SubscriptionService]
})
export class EmployerProfileComponent implements OnInit{
    host: string = host;
    code_confirm_email = '';
    update: boolean = false;
    user_id: string = localStorage.getItem('user_id');
    confirm_email: string;
    check_confirm_email: boolean;
    employer: Employer;
    check: boolean = true;
    pay_open: boolean = false;
    choose: boolean[] = [true, false, false];
    subscription: Subscription = new Subscription;
    new_subscription: Subscription = new Subscription;
    CurrentFile: File;
    imageSource: string;
    formData: FormData = new FormData();
    updateEmployer: EmployerUpdate = new EmployerUpdate;
    receive: number;
    constructor(private httpService: EmployerProfileService,
                private activateRoute: ActivatedRoute,
                private service: SubscriptionService,
                private commonService: HttpService,
                private employerComponent: EmployerComponent){
      // this.update = activateRoute.snapshot.queryParams['edit'];
    }

    ngOnInit(){
        this.confirm_email = localStorage.getItem('email_confirm');
        if (this.confirm_email == 'True') {
          this.check_confirm_email = true;
        } else {
          this.check_confirm_email = false;
        }
        this.pay_open = false;
        this.httpService.getCreator(host+'employer/'+this.user_id+'/').subscribe((data:Employer)=> {
          this.employer=data;
          this.updateEmployer.first_name = this.employer.first_name;
          this.updateEmployer.last_name = this.employer.last_name;
        });
        this.new_subscription.type = 1;
        return this.service.getSubscription(host+'payment/?employer__id='+this.user_id+'&limit=1&ordering=-start_date').subscribe((data: Subscription) => {
          this.subscription = data['results'][0];
        });
    }
    open_pay(){
      this.pay_open = true;
    }
    close_pay(){
      this.pay_open = false;
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
    public FileChangeEvent(fileInput: any){
      this.CurrentFile = fileInput.target.files[0];
      this.formData.append( 'name', this.CurrentFile.name);

      let reader = new FileReader();
      reader.onload = () => {
        this.imageSource = reader.result;
        this.formData.append('image', this.CurrentFile);
        this.httpService.putImgEmployer(this.formData, this.host+'new_img_employer/' + this.user_id + '/')
          .subscribe(
            data => {
              // this.castDetail.image = data['image_url'];
              this.ngOnInit();
              this.employerComponent.getEmployer();
            },
            error => console.log(error)
          );
      };
      reader.readAsDataURL(this.CurrentFile);
    }
    change_name(){
      this.update = !this.update;
    }
    change_name_submit(updateEmployer){
      this.httpService.putNameEmployer(updateEmployer, this.host +'update_employer_name/'+this.user_id+'/')
        .subscribe(
          data => {this.receive = data["employer_id"];
            this.update = !this.update;
            this.ngOnInit();
            this.employerComponent.getEmployer();
          },
        );
    }
   send_confirm_code(code_confirm: string){
      this.commonService.postConfirmEmail(code_confirm, this.user_id, this.host + 'confirm_email/').subscribe(
        data => {
          localStorage.setItem('email_confirm', 'True');
          this.ngOnInit();
        },
        error => {
            this.code_confirm_email = 'Неверный код';
        }
      );
   }
}
