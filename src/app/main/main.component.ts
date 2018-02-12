import { Component, OnInit} from '@angular/core';
import { HttpService} from '../http.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-main-app',
    template: `
                <div>
                    <home-app></home-app>
                </div>
                `,
    providers: [HttpService]
})
export class MainComponent implements OnInit{
    auth: boolean = false;
    user_type: string = '0';
    token: any = '';
    constructor(private httpService: HttpService, private router: Router){}
    ngOnInit() {
      // localStorage.setItem('token', '');
      try {
        this.token = localStorage.getItem('token');
        if (this.token.length > 0) {
          this.auth = true;
          this.user_type = localStorage.getItem('user_type');
          if (this.user_type == '1') {
            this.router.navigate(['/employee']);
          }
          if (this.user_type == '2') {
            this.router.navigate(['/employer']);
          }
        }
        else {
          this.auth = false;
        }
      }
      catch (e) {
        this.auth = false;
      }
    }
}
