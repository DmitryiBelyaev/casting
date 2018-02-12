import {Component, OnInit} from '@angular/core';
import { RegService } from '../../services/reg.service';
import {HttpService} from "../../http.service";
import {User} from '../../models/user';
import {Auth} from '../../models/auth';
import {Router} from '@angular/router';
import { ActivatedRoute} from '@angular/router';
import {host} from "../../config";

@Component({
    selector: 'reg-app',
    templateUrl: 'reg.component.html',
    styleUrls: ['./reg.component.css'],
    providers: [RegService, HttpService]
})
export class RegComponent implements OnInit{
    state: number;
    host: string = host;
    type: boolean;

    user: User = new User();

    receivedUser: User;
    receivedAuth: Auth;
    done: boolean = true;
    constructor(private regService: RegService,
                private httpService: HttpService,
                private router: Router,
                private activateRoute: ActivatedRoute){
        this.state = activateRoute.snapshot.params['state'];
    }
    ngOnInit(){
      if (this.state == 0 || this.state == 1){
        this.type = true;
      }
      else{
        this.type = false;
      }
    }
    submit(user: User, type: boolean){
      let fullname_arr = user.full_name.split(" ", 2);
      user.first_name = fullname_arr[0];
      user.last_name = fullname_arr[1];
      if (type) {
            this.regService.postDataEmployee(user, host+'employee/')
                .subscribe(
                    (data: User) => {
                        this.receivedUser = data;
                        this.httpService.postAuth(user)
                            .subscribe(
                                (data: Auth) => {
                                    this.receivedAuth = data;
                                    this.done = true;
                                    localStorage.setItem('token', this.receivedAuth.token);
                                    localStorage.setItem('user_type', '1');
                                    localStorage.setItem('user_id', this.receivedUser.id.toString());
                                    localStorage.setItem('email_confirm', this.receivedAuth.confirm_email);
                                    this.router.navigate(['/employee'], {
                                      queryParams:{
                                        'edit': true,
                                      }
                                    });
                                },
                                error => { console.log(error);
                                this.done = false;
                                },
                            );
                    },
                    error => {console.log(error);
                      this.done = false;
                    },
                );
        }
        else {
            this.regService.postDataEmployer(user, host+'employer/')
                .subscribe(
                    (data: User) => {
                        this.receivedUser = data;
                        this.done = true;
                        this.httpService.postAuth(user)
                            .subscribe(
                                (data: Auth) => {
                                    this.receivedAuth = data;
                                    this.done = true;
                                    localStorage.setItem('token', this.receivedAuth.token);
                                    localStorage.setItem('user_type', '2');
                                    localStorage.setItem('user_id', this.receivedUser.id.toString());
                                    localStorage.setItem('email_confirm', this.receivedAuth.confirm_email);
                                  this.router.navigate(['/employer'], {
                                    queryParams:{
                                      'edit': true,
                                    }
                                  });
                                },
                                error => { console.log(error);
                                  this.done = false;
                                },
                            );
                    },
                    error => {
                        console.log(error);
                      this.done = false;
                    },
                );
        }
    }

}
