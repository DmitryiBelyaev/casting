import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Employer} from "../../models/employer";
import {Role} from "../../models/role";
import {RoleListService} from "../../services/role-list.service";
import {EmployeeProfileService} from "../../services/employee-profile.service";
import {Employee} from "../../models/employee";
import {EmployerProfileService} from "../../services/employer-profile.service";
import {InviteService} from "../../services/invite.service";
import {Invite} from "../../models/invite";
import {host} from "../../config";
import {Casting} from "../../models/casting";
import {CastingListService} from "../../services/casting-list.service";
import {EmployeeListComponent} from "../employee-list/employee-list.component";
import {EmployeeListService} from "../../services/employee-list.service";
import {CastingDetailService} from "../../services/casting-detail.service";
import {RoleService} from "../../services/role.service";
import {EmployeeDetailComponent} from "../employee-detail/employee-detail.component";
import {ContactsService} from "../../services/contacts.service";
import {Employy_foto_listService} from "../../services/employy_foto_list.service";
import {ParametersService} from "../../services/parameters.service";
import {PortfolioService} from "../../services/portfolio.service";
import {PollsService} from "../../services/polls.service";

@Component({
    selector: 'invite-create-detail-app',
    templateUrl: './invite-create-detail.component.html',
    styleUrls: ['./invite-create-detail.component.css'],
    providers: [RoleListService, EmployeeProfileService,EmployerProfileService,InviteService, CastingListService, EmployeeListComponent, EmployeeListService,CastingDetailService,RoleService
    , EmployeeDetailComponent, ContactsService, Employy_foto_listService, ParametersService, PortfolioService, PollsService
    ]
})
export class InviteCreateDetailComponent implements OnInit{
    @Input() employee_id: number;
    @Output() invite_active = new EventEmitter<boolean>();
    @Output() invisible = new EventEmitter<boolean>();
    invite: Invite = new Invite();
    roles: Role[];
    casting: Casting[];
    casting_id: number = 999;
    invites: any;
    employee: Employee;
    employer: Employer;
    user_id: string = localStorage.getItem('user_id');
    role_id: number;


    constructor(private roleService: RoleListService,
                private activateRoute: ActivatedRoute,
                private inviteService: InviteService,
                private castingSerivce: CastingListService,
                private employeeList: EmployeeListComponent,
                private emploeeDetail: EmployeeDetailComponent
    ) {}

    ngOnInit(){
        this.castingSerivce.getCastingWithoutLimit(host+'castinglist/?owner_id='+'&status=true'+this.user_id).subscribe(data => {
          this.casting=data;
    });
    }
    submit(invite: Invite){
        this.invite.employer = this.user_id;
        this.invite.employee = this.employee_id.toString();
        this.inviteService.postInvite(invite, host+'new_invite/').subscribe(data => {
          this.invites = data;
          this.invite_active.emit(false);
          this.invisible.emit(true);
          this.casting_id = 999;
          this.roles = null;
        });
    }
    select_casting(casting_id: number){
      this.roleService.getRoleListWithoutLimit(host+'role/?casting_id='+'&status=2'+casting_id.toString() + '&invite__employee__id='+ this.employee_id + '&request__employee__id=' + this.employee_id).subscribe(data => {
        this.roles = data;
        this.invite.role = 'null';
      });
    }
}
