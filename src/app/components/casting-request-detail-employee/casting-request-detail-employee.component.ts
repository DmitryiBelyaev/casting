import {AfterContentInit, Component, DoCheck, Input, OnChanges, OnInit} from '@angular/core';
import {host} from '../../config';
import {CastingDetailComponent} from '../casting-detail/casting-detail.component';
import {RequestListService} from "../../services/request-list.service";
import {Employee} from "../../models/employee";
import {EmployeeListService} from "../../services/employee-list.service";
import {RequestDetail} from "../../models/requestDetail";
import {StatusService} from "../../services/status.service";
import {RequestListComponent} from "../request-list/request-list.component";
import {Status} from "../../models/status";


@Component({
  selector: 'app-casting-request-detail-employee-app',
  templateUrl: './casting-request-detail-employee.component.html',
  styleUrls: ['./casting-request-detail-employee.component.css'],
  providers: [RequestListService, EmployeeListService, StatusService]
})
export class CastingRequestDetailEmployeeComponent implements  OnChanges {
  @Input() role_id: number;
  @Input() role_name: string;
  host = host;
  requestlist: any[]= [];
  employeelist: any[] = [];
  employeeDetail: Employee;
  statusDetail: Status;
  visibility: boolean;
  Datarequestlist: any[] = [];
  func(request_item: any) {
      this.employeedetailService.getEmployeeDetail(request_item.employee).subscribe((dataemployee: Employee) => {
        this.employeeDetail = dataemployee;
        request_item['employee'] = this.employeeDetail;
        this.statusService.getStatus(request_item.status).subscribe((datastatus: Status) => {
          this.statusDetail = datastatus;
          request_item['status'] = this.statusDetail;
        });
      });
      return request_item;
  }
  constructor( private castingComponent: RequestListComponent,
               private requestlistService: RequestListService,
               private employeedetailService: EmployeeListService,
               private statusService: StatusService) {}
  init() {
    this.Datarequestlist = [];
    this.requestlistService.getRequestList(host + 'request/?role_id=' + this.role_id + '&status_id=22').subscribe((datarequest) =>{
      this.requestlist = datarequest;
      console.log(this.requestlist);
      for (const item of this.requestlist ){
        this.Datarequestlist.push(this.func(item));
        console.log(this.Datarequestlist);
      }
    });
  }
  ngOnChanges() {
    this.init();
  }
  changeStatus(item: any, status_id: number) {
    this.statusService.putStatus(status_id, host + 'change_status_request/' + item.id + '/' ).subscribe(
      data => {
        item['status'].status_id = data['status_id'];
        this.castingComponent.ngOnInit();
        this.init();
      }
    );
  }
  close_window() {
    this.castingComponent.open_close_window();
  }
}

