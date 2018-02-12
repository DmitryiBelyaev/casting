import { Component, OnInit} from '@angular/core';
import {EmployeeProfileService} from "../services/employee-profile.service";
import {CanDeactivate, Router} from '@angular/router';
import {host} from "../config";
import {Employee} from "../models/employee";

import {Observable} from "rxjs/Observable";

@Component({
    selector: 'employee-app',
    templateUrl: './employee.component.html',
    providers: [EmployeeProfileService],
    styleUrls: ['./employee.component.css']
})
export class EmployeeComponent {
    host = host;
    visibility: boolean = false;
    check: boolean = true;
    employee: Employee = new Employee;
    switchfunc(event:any){
      console.log('event', event);
      if (event.check == true) {
        this.check = true;
      }
      else {
        this.check = false;
      }
    }
    constructor(private employeeService: EmployeeProfileService){}
    ngOnInit(){
        this.getEmployee();
    }
    getEmployee(){
      let user_id:string = localStorage.getItem('user_id');
      this.employeeService.getEmployee(host+'employee/'+user_id+'/').subscribe((data:Employee)=> this.employee=data);
    }
    Guard_log_out() {
      this.visibility = !this.visibility;
    }
}

