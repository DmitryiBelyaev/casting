import {RequestDetail} from "../../models/requestDetail";
import {Component, OnInit} from "@angular/core";
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
import {Status} from "../../models/status";
import {StatusService} from "../../services/status.service";
import {InvaiteListService} from "../../services/invaite-list.service";
import {Invite} from "../../models/invite";

@Component({
    selector: 'request-list-employee-app',
    templateUrl:'./request-list-employee.component.html',
    styleUrls: ['request-list-employee.component.css'],
    providers: [InvaiteListService,RoleService,EmployeeListService,CastingDetailService,StatusService]
})

export class RequestListEmployeeComponent {
    host = host;
    user_id: string = localStorage.getItem('user_id');
    requests: any;
    requestsData: any[] = [];
    employeeDetail:Employee;
    roleDetail: Role;
    castingurl: string;
    castingDetail : Casting;
    status: any;
    next: any;
    limit: number = 6;
    offset:number = 0;
    constructor(private httpService:  InvaiteListService,
                private employeeService: EmployeeListService,
                private roleService: RoleService,
                private castingDetailService: CastingDetailService,
                private statusService: StatusService){}

    func(request_item: any){
        this.employeeService.getEmployeeDetail(request_item.employee).subscribe((dataemp:Employee) => {
            this.employeeDetail = dataemp;
            request_item['employeeDetail'] = this.employeeDetail;
            this.roleService.getRole(request_item.role).subscribe((datarol: Role) => {
                this.roleDetail = datarol;
                request_item['roleDetail'] = this.roleDetail;
                this.castingurl = this.roleDetail.casting;
                this.castingDetailService.getDetail(this.castingurl).subscribe((datacast: Casting) => {
                    this.castingDetail = datacast;
                    request_item['castingDetail'] = this.castingDetail;
                });
                this.statusService.getStatus(request_item.status).subscribe((datastatus: Status) => {
                    this.status = datastatus;
                    request_item['statusDetail'] = this.status;
                });
            });
        });
        return request_item;
    }
    ngOnInit(){
        this.getInvite(this.offset);
    }
    getInvite(offset: number){
      this.httpService.getInviteLists(host + 'invite/?employee_id='+this.user_id + '&limit=' + this.limit + '&offset=' + offset).subscribe((data) =>{
        this.requests=data[1];
        this.next = data [0];
        for (let invite_item in this.requests) {
          this.requestsData.push(this.func(this.requests[invite_item]));
        }

      });
    }
    changeStatus(request: Invite, status_id: number) {
        this.statusService.putStatus(status_id, host + 'change_status_invite/' + request.id + '/' ).subscribe(
            data => {
              request['statusDetail'].status_id = data['status_id'];
              request['statusDetail'].name = data['status_name'];
             }
        );
    }
  more() {
    this.offset += this.limit;
    this.getInvite(this.offset);
  }
}
