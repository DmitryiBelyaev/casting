import { Component, OnInit} from '@angular/core';
import {Invite} from "../../models/invite";
import {InvaiteListService} from "../../services/invaite-list.service";
import {EmployeeListService} from "../../services/employee-list.service";
import {Employee} from "../../models/employee";
import {RoleService} from "../../services/role.service";
import {Role} from "../../models/role";
import {host} from "../../config";
import {CastingDetailService} from "../../services/casting-detail.service";
import {Casting} from "../../models/casting";
import {StatusService} from "../../services/status.service";
import {Status} from "../../models/status";
import {RequestListService} from "../../services/request-list.service";
import {RequestDetail} from "../../models/requestDetail";

@Component({
    selector: 'invite-list-employee-app',
    templateUrl:'./invite-list-employee.component.html',
    styleUrls: ['invite-list-employee.component.css'],
    providers: [RequestListService,EmployeeListService,RoleService,CastingDetailService, StatusService,]
})

export class InviteListEmployeeComponent {
    host = host;
    user_id: string = localStorage.getItem('user_id');
    invites: any;
    invitesData: any[] = [];
    employeeDetail: Employee;
    roleDetail: Role;
    castingurl: string;
    castingDetail: Casting;
    status: Status;
    limit: number = 10;
    offset:number = 0;
    next: any;
    constructor(private httpService: RequestListService,
                private employeeService: EmployeeListService,
                private roleService: RoleService,
                private castingDetailService: CastingDetailService,
                private statusService: StatusService,){}

    func(invite_item: any){
        this.employeeService.getEmployeeDetail(invite_item.employee).subscribe((dataemp:Employee) => {
            this.employeeDetail = dataemp;
            invite_item['employeeDetail'] = this.employeeDetail;
            this.roleService.getRole(invite_item.role).subscribe((datarol: Role) => {
                this.roleDetail = datarol;
                invite_item['roleDetail'] = this.roleDetail;
                this.castingurl = this.roleDetail.casting;
                this.castingDetailService.getDetail(this.castingurl).subscribe((datacast: Casting) => {
                    this.castingDetail = datacast;
                    invite_item['castingDetail'] = this.castingDetail;
                });
                this.statusService.getStatus(invite_item.status).subscribe((datastatus: Status) => {
                    this.status = datastatus;
                    invite_item['statusDetail'] = this.status;
                })
            });
        });
        return invite_item;
    }
    ngOnInit(){
       this.getRequest(this.offset);
    }
    getRequest(offset: number){
    this.httpService.getRequestLists(host + 'request/?employee_id=' + this.user_id + '&limit=' + this.limit + '&offset=' + offset).subscribe((data) =>{
        this.invites = data[1];
        this.next = data[0];
        for (let request_item in this.invites) {
          this.invitesData.push(this.func(this.invites[request_item]));
        }
      });
    }
    changeStatus(invite: Invite, status_id: number) {
      this.statusService.putStatus(status_id, host + 'change_status_request/'  + invite.id + '/').subscribe(
        data => {invite['statusDetail'].status_id = data['status_id'];
          invite['statusDetail'].name_employee = data['status_name'];}
        );
    }
  more() {
    this.offset += this.limit;
    this.getRequest(this.offset);
  }

}
