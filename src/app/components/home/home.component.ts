import { Component, OnInit} from '@angular/core';
import { HttpService} from '../../http.service';
import {host} from "../../config";

declare var jquery:any;
declare var $ :any;

@Component({
    selector: 'home-app',
    templateUrl: './home.component.html',
    providers: [HttpService],
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{
    toggleTheme(classname){
      $('.' + classname).slideToggle(200);
    }
    outImage(imagename){
      $('.' + imagename).fadeOut(200);
    }
    inImage(imagename){
      $('.' + imagename).fadeIn(200);
    }
    host = host;
    state: number = 0;
    visibility_main = true;
    visibility_employee = false;
    visibility_employer = false;
    visibility_employer_sub = false;
    visibility_employee_sub = false;
    toggle_empl(state:number) {
      if (state == 3){
        this.state = state;
        this.visibility_main = false;
        this.visibility_employee = false;
        this.visibility_employer = false;
        this.visibility_employer_sub = true;
        this.toggleTheme('content_info_employer');
        this.toggleTheme('content_info_employer_sub');
      }
      else if (state == 4){
        this.state = 2;
        this.visibility_main = false;
        this.visibility_employee = false;
        this.visibility_employer = true;
        this.visibility_employer_sub = false;
        this.toggleTheme('content_info_employer_sub');
        this.toggleTheme('content_info_employer');
      }
      else if (state == 2) {
        this.state = state;
        this.visibility_main = false;
        this.visibility_employee = false;
        this.visibility_employer = true;
        this.visibility_employer_sub = false;
        this.toggleTheme('content_info_main');
        this.toggleTheme('content_info_employer');
        this.outImage('main-image');
        this.inImage('employer-image');
      }
      else if (state == 1) {
        this.state = state;
        this.visibility_main = false;
        this.visibility_employee = true;
        this.visibility_employer = false;
        this.visibility_employer_sub = false;
        this.toggleTheme('content_info_main');
        this.toggleTheme('content_info_employee');
        this.outImage('main-image');
        this.inImage('employee-image');
        // this.toggleTitle('content_info_employer');
        // this.toggleTitle('content_info_employer_sub');
      }
      else {
        this.state = state;
        if (this.visibility_employee){
          this.toggleTheme('content_info_main');
          this.toggleTheme('content_info_employee');
          this.outImage('employee-image');
          this.inImage('main-image');
        }
        else if (this.visibility_employer){
          this.toggleTheme('content_info_main');
          this.toggleTheme('content_info_employer');
          this.outImage('employer-image');
          this.inImage('main-image');
        }
        else {
          this.toggleTheme('content_info_main');
          this.toggleTheme('content_info_employer_sub');
          this.outImage('employer-image');
          this.inImage('main-image');
        }
        this.visibility_main = true;
        this.visibility_employee = false;
        this.visibility_employer = false;
        this.visibility_employer_sub = false;
      }
    }
    constructor(){}
    ngOnInit(){}
}
