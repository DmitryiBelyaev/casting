import {Casting} from "../../models/casting";
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import {Component, OnInit} from "@angular/core";
import {CastingType} from "../../models/casting-type";
import {Employer} from "../../models/employer";
import {HttpClient} from "@angular/common/http";
import {CastingDetailService} from "../../services/casting-detail.service";
import { ActivatedRoute} from '@angular/router';
import {Role} from "../../models/role";
import {RoleService} from "../../services/role.service";
import {host} from "../../config";
import {RequestListService} from "../../services/request-list.service";
import {EmployeeDetailService} from "../../services/employee-detail.service";
import {RequestDetail} from "../../models/requestDetail";
import {CastingListService} from "../../services/casting-list.service";
import {RequestCreate} from "../../models/requestCreate";
import {RoleListService} from "../../services/role-list.service";
import {InviteService} from "../../services/invite.service";
import {StatusService} from "../../services/status.service";
import {Status} from "../../models/status";


@Component({
    selector: 'casting-detail-app',
    styleUrls:['./casting-detail-employee.component.css'],
    templateUrl:'./casting-detail-employee.component.html',
    providers: [CastingListService, RoleService, RequestListService, EmployeeDetailService, CastingDetailService,
      RoleListService, InviteService, StatusService]
})

export class CastingDetailEmployeeComponent implements OnInit{
    host: string = host;
    id: number;
    user_id: string = localStorage.getItem('user_id');
    castDetail: Casting;
    castType: CastingType;
    castOwner: Employer;
    role: Role;
    requests: RequestDetail[]=[];
    castingList: Casting[];
    castingData: any[] = [];
    request_id: number;
    request: RequestCreate = new RequestCreate();
    check: boolean = true;
    map_address = '';
    map_url: SafeResourceUrl;
    map_query = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyACh86K7LB5yBNCIjfvwlJUi2IMhWKAiL0&q=';
    status: Status;
    constructor(private castingListService: CastingListService,
                private activateRoute: ActivatedRoute,
                private roleService: RoleService,
                private requestService: RequestListService,
                private inviteSerivce: InviteService,
                private employeeDetailService: EmployeeDetailService,
                private  castingdetailService: CastingDetailService,
                private rolelistService: RoleListService,
                private sanitizer: DomSanitizer,
                private statusService: StatusService){
        this.id = activateRoute.snapshot.params['id'];
    }
    func(castingItem: any){
        for (let item_role in castingItem.role_set) {
            this.roleService.getRole(castingItem.role_set[item_role]).subscribe(datarole => {
                castingItem.role_set[item_role] = datarole;
                this.requestService.getRequest(this.host + 'request/?employee_id=' + this.user_id + '&role_id=' + castingItem.role_set[item_role]['id'] ).subscribe(datarequest => {
                    castingItem.role_set[item_role]['requests'] = datarequest;

                    for (let item of castingItem.role_set[item_role]['requests']){
                    this.statusService.getStatus(item['status']).subscribe(statusdata =>{
                      castingItem.role_set[item_role]['requests']['status'] = statusdata;

                      });
                    }
                });
                    // for (let item_request in castingItem.role_set[item_role]['requests']){
                    //     this.employeeDetailService.getEmployee(castingItem.role_set[item_role]['requests'][item_request].employee).subscribe(dataemployee => {
                    //         castingItem.role_set[item_role]['requests'][item_request]['employee_data'] = dataemployee;
                    //     });
                    // }
                 this.inviteSerivce.getInvite(this.host + 'invite/?employee_id=' + '&role_id=' + castingItem.role_set[item_role]['id']).subscribe(datainvite => {
                   castingItem.role_set[item_role]['invites'] = datainvite;
                 for (let item of castingItem.role_set[item_role]['invites']){
                   this.statusService.getStatus(item['status']).subscribe(statusdataInv =>{
                     castingItem.role_set[item_role]['invites']['status'] = statusdataInv;
                   });
                 }
                 });
            });
        }
        return castingItem;
    }
    init() {
      this.castingdetailService.getDetail(host+'castinglist/'+this.id.toString()+ '/').subscribe((data:Casting) => {
        this.castDetail=data;
        this.castingData=this.func(this.castDetail);
        console.log(this.castingData, 'asdfsafsdfasfsadf');


        this.castingdetailService.getType(this.castDetail.type).subscribe((data:CastingType) => this.castType=data);
        this.castingdetailService.getOwner(this.castDetail.owner).subscribe((data:Employer) => this.castOwner=data);
        this.get_map_url(this.castDetail.address);
      });
    }

    ngOnInit() {
      this.init();
    }

    CreateRequest(role_id: number){
        this.request.employee_id = this.user_id;
        this.request.employer_id = this.castOwner.id.toString();
        this.request.role_id = role_id.toString();
        this.rolelistService.CreateRequest(host + 'new_request/', this.request).subscribe(data => {
          this.request_id = data['request_id'];
          this.init();
        });

    }
    get_map_url(address: string){
      this.map_address = address.replace(/\s/gi, '+');
      this.map_url = this.sanitizer.bypassSecurityTrustResourceUrl(this.map_query + this.map_address);
    }
}
