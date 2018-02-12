import {RequestDetail} from "../../models/requestDetail";
import {AfterViewChecked, AfterViewInit, Component, DoCheck, OnChanges, OnInit} from "@angular/core";
import {RequestListService} from "../../services/request-list.service";
import {Role} from "../../models/role";
import {RoleService} from "../../services/role.service";
import {Employee} from "../../models/employee";
import {EmployeeListService} from "../../services/employee-list.service";
import {host} from "../../config";
import {Casting} from "../../models/casting";
import {CastingDetailService} from "../../services/casting-detail.service";
import {CastingListService} from "../../services/casting-list.service";
import {EmployeeDetailService} from "../../services/employee-detail.service";
import {CastingRequestDetailEmployeeComponent} from "../casting-request-detail-employee/casting-request-detail-employee.component";
import {subscribeOn} from "rxjs/operator/subscribeOn";


@Component({
    selector:'request-app',
    templateUrl:'./request-list.component.html',
    styleUrls: ['request-list.component.css'],
    providers:[RequestListService, RoleService, EmployeeDetailService, CastingListService]
})

export class RequestListComponent implements OnInit {
    host = host;
    requests: RequestDetail;
    castingList: any;
    role: Role;
    castingAllData: any[] = [];
    limit: number = 100;
    offset:number = 0;
    next: any;
    check_more: boolean = false;
    user_id = localStorage.getItem('user_id');
    visibility: boolean = true;
    request_role_id: number;
    request_role_name: string;
    castingData: any[] = [];

    constructor(private requestService: RequestListService,
                private roleService: RoleService,
                private employeeDetailService: EmployeeDetailService,
                private castingListService: CastingListService,
                ) {}

    // func(castingItem: any) {
    //     for (let item_role in castingItem.role_set) {
    //         this.roleService.getRole(castingItem.role_set[item_role]).subscribe(datarole => {
    //             if (datarole['id'] !== undefined && datarole['id'] !== null){
    //               this.requestService.getRequestList(host + 'request/?role_id=' + datarole['id'] + '&status_id=22')
    //                 .subscribe(datarequest => {
    //                   if (datarequest.length > 0) {
    //                     castingItem.role_set[item_role] = datarole;
    //                     castingItem.role_set[item_role]['requests'] = datarequest;
    //                     for (let item_request in castingItem.role_set[item_role]['requests'] ) {
    //                       this.employeeDetailService.getEmployee(castingItem.role_set[item_role]['requests'][item_request].employee)
    //                         .subscribe(dataemployee => {
    //                           castingItem.role_set[item_role]['requests'][item_request]['employee_data'] = dataemployee;
    //                         });
    //                     }
    //                   } else {
    //                     castingItem.role_set.splice(item_role, 1);
    //                   }
    //                 });
    //             }
    //         });
    //     }
    //     return castingItem;
    // }
    ngOnInit() {
      this.castingData = [];
        this.getCastList(this.castingData, this.offset);
    }
    getCastList(castingData, offset: number){
      this.castingListService.getCastingRequest(host + 'request_castig_employer/' + this.user_id + '/').subscribe(data => {
        this.castingList = data;
        for (let casting of this.castingList){
          let role_set = [];
          let casting_elem: any;
          for (let role of casting.role_set){
            let request_set = [];
            for (let request of role.request_set){
              if (request.status.status_id === 33 || request.status.status_id === 0){
                request_set.push(request);
              }
            }
            if (request_set.length > 0) {
              role.request_set = request_set;
              role_set.push(role);
            }
          }
          if (role_set.length > 0){
            casting_elem = casting;
            casting_elem.role_set = role_set;
            castingData.push(casting_elem);
          }
        }
      });
    }
    more() {
      this.offset += this.limit;
      this.getCastList(this.castingAllData, this.offset);
    }
  open_window_role(id: number, name: string) {
    this.request_role_id = id;
    this.request_role_name = name;
    console.log(this.request_role_id);
  }
  open_close_window() {
    this.visibility = !this.visibility ;
  }
}
