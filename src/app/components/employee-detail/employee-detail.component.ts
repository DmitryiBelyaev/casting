import {Component, OnInit} from "@angular/core";
import {EmployeeDetailService} from "../../services/employee-detail.service";
import {ContactsService} from "../../services/contacts.service";
import {Employee} from "../../models/employee";
import {Contacts} from "../../models/contacts";
import {ParametersService} from "../../services/parameters.service";
import {ParametersDetail} from "../../models/parametersDetail";
import {ActivatedRoute} from "@angular/router";
import {host} from "../../config";
import {PortfolioService} from "../../services/portfolio.service";
import {Employy_foto_listService} from "../../services/employy_foto_list.service";
import {Portfolio} from "../../models/portfolio";
import {Employee_foto} from "../../models/employee_foto";
import {PollsService} from "../../services/polls.service";
import {RoleService} from "../../services/role.service";
import {CastingDetailService} from "../../services/casting-detail.service";
import {Role} from "../../models/role";
import {Casting} from "../../models/casting";


@Component({
    selector:'employee-detail-app',
    styleUrls:['./employee-detail.component.css'],
    templateUrl: './employee-detail.component.html',
    providers:[EmployeeDetailService,ContactsService,ParametersService,Employy_foto_listService,PortfolioService, PollsService, CastingDetailService, RoleService]
})

export class EmployeeDetailComponent implements  OnInit {
    host = host;
    my_user_id: string = localStorage.getItem('user_id');
    user_id: string;
    check_voice = false;
    profile: Employee = new Employee;
    param: string;
    parameters: ParametersDetail = new ParametersDetail;
    cont: string;
    check: boolean = true;
    invite_active: boolean = false;
    invite_employee_id: number;
    contacts: Contacts = new Contacts;
    photos:Employee_foto[]=[];
    portfolios: Portfolio[]=[];
    empty_oreh= this.host + 'static/img/emplyOreh.svg';
    oreh = [this.empty_oreh, this.empty_oreh, this.empty_oreh, this.empty_oreh, this.empty_oreh];
    full_oreh= this.host + 'static/img/10-7.svg';
    middle_oreh = this.host + 'static/img/7-4.svg';
    low_oreh = this.host + 'static/img/4-0.svg';
    rating_voice: any;
    path_photo: boolean = true;
    invisible: boolean = false;
    invis: boolean = false;

    constructor(private employeeDetailService: EmployeeDetailService,
                private contactsService: ContactsService,
                private parametersService: ParametersService,
                private activateRoute: ActivatedRoute,
                private fotoService: Employy_foto_listService,
                private portfolioService: PortfolioService,
                private pollsService: PollsService,
                private castingDetailService: CastingDetailService,
                private employeeService: EmployeeDetailService,
                private roleService: RoleService) {
        this.user_id = this.activateRoute.snapshot.params['id'];
    }

    ngOnInit() {
        this.employeeDetailService.getEmployee(host+'employee/'+this.user_id+'/').subscribe((data: Employee) => {
            this.profile = data;
            if (this.profile.check_params){
                this.param = this.profile.param_list;
                this.parametersService.getParameters(this.param).subscribe((dataparam: ParametersDetail) => this.parameters = dataparam);
            }
            if (this.profile.check_contacts){
                this.cont = this.profile.contacts;
                this.contactsService.getContacts(this.cont).subscribe((datacontact: Contacts) => this.contacts = datacontact);
            }
        });
        this.fotoService.getFotos(host+'employee_photo/?employee_id='+this.user_id).subscribe(datafoto => this.photos = datafoto);
        this.portfolioService.getPortfolios(host+'portfolioelem/?employee_id='+this.user_id).subscribe(portfoliodata => this.portfolios = portfoliodata);
        this.pollsService.getVoice(host+'review/' + this.user_id + '/?employer_id=' + this.my_user_id).subscribe( res => {
            this.check_voice = true;
            this.rating_voice = res['voice'];
          },
          error => { console.log(error);
            this.check_voice = false;
          },
          );
    }
    inviteActive(employee_id: number){
      this.invite_employee_id = employee_id;
      this.invite_active = true;
    }
    inviteDeactive(){
      this.invite_active = false;
    }
    go_poll(voice:number){
      if (voice == 1){
        this.oreh = [this.low_oreh, this.empty_oreh, this.empty_oreh, this.empty_oreh, this.empty_oreh];
      } else if (voice == 2) {
        this.oreh = [this.low_oreh, this.low_oreh, this.empty_oreh, this.empty_oreh, this.empty_oreh];
      } else if (voice == 3) {
        this.oreh = [this.middle_oreh, this.middle_oreh, this.middle_oreh, this.empty_oreh, this.empty_oreh];
      } else if (voice == 4) {
        this.oreh = [this.full_oreh, this.full_oreh, this.full_oreh, this.full_oreh, this.empty_oreh];
      } else if (voice == 5) {
        this.oreh = [this.full_oreh, this.full_oreh, this.full_oreh, this.full_oreh, this.full_oreh];
      }
      this.pollsService.postVoice(voice, this.my_user_id, host+'review/' + this.user_id + '/').subscribe(res=>{
       this.check_voice = true;
       this.invis = true;
        setTimeout(() => {
            this.invis = false;
          },
          2000);
      });
    }
  open_Photo() {
    this.path_photo = !this.path_photo;
  }
  notifi_emit(){
    this.invisible = true;
    setTimeout(() => {
        this.invisible = false;
      },
      2000);
  }
}
