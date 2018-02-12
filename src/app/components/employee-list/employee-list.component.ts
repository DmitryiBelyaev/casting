import {Employee} from "../../models/employee";
import {Component, Input, OnInit} from "@angular/core";
import {EmployeeListService} from "../../services/employee-list.service";
import {host} from "../../config";
import {ParametersDetail} from "../../models/parametersDetail";
import {ParametersCreate} from "../../models/parametersCreate";
import {ParametersService} from "../../services/parameters.service";
import {Haircolor} from "../../models/haircolor";
import {Employmenttype} from "../../models/employmenttype";
import {Gender} from "../../models/gender";
import {Eyecolor} from "../../models/eyecolor";
import {City} from "../../models/city";
import {Appearancetype} from "../../models/appearancetype";
import {CastingListService} from "../../services/casting-list.service";
import {EmployeeDetailService} from "../../services/employee-detail.service";
import {RoleService} from "../../services/role.service";
import {CastingDetailService} from "../../services/casting-detail.service";
import {Casting} from "../../models/casting";
import {Role} from "../../models/role";

@Component({
    selector:'employee-list-app',
    templateUrl: './employee-list.component.html',
    providers:[EmployeeListService, ParametersService, RoleService, EmployeeDetailService, CastingDetailService],
    styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit{
    host = host;
    employees: any;
    active_order:boolean = true;
    gender_id: string = "0";
    filter_gender: string = "";
    filter_order: string = 'date_joined';
    filter_search:string = '';
    check: boolean = false;
    invite_active: boolean = false;
    invite_employee_id: number;
    searchparameters: ParametersCreate = new ParametersCreate;
    haircolors: Haircolor[] = [];
    employmenttypes: Employmenttype[] = [];
    genders: Gender[] = [];
    eyecolors: Eyecolor[] =[];
    citys: City[] = [];
    appearancetypes: Appearancetype[] = [];
    tatu: boolean = false;
    piercing: boolean = false;
    bigsearch: boolean = false;
    next: any;
    previous: any;
    limit: number = 10;
    offset:number = 0;
    emplList: any[] = [];
    castDetail: Casting;
    emplDetail: Employee;
    roleDetail: Role;
    invisible: boolean = false;
    constructor(private httpService: EmployeeListService,
                private paramService: ParametersService,
                private castingDetailService: CastingDetailService,
                private employeeService: EmployeeDetailService,
                private roleService: RoleService){}

    ngOnInit(){
        for (let item in this.searchparameters){
          this.searchparameters[item] = '';
        }
        this.get_content(this.filter_gender, this.filter_order, this.filter_search, this.searchparameters, this.offset);
        this.paramService.getHaircolor(host+'haircolor/').subscribe(data => this.haircolors=data);
        this.paramService.getGender(host+'gender/').subscribe(data => this.genders=data);
        this.paramService.getEyecolor(host+'eyecolor/').subscribe(data => this.eyecolors=data);
        this.paramService.getCity(host+'city/').subscribe(data => this.citys=data);
        this.paramService.getAppearancetype(host+'appearancetype/').subscribe(data => this.appearancetypes=data);
        this.paramService.getEmploymenttype(host+'employmenttype/').subscribe(data => this.employmenttypes=data);
    }

    get_content(filter_gender:string, filter_order:string, filter_search:string, params: any, offset: number){
        let url: string = host+'employee_list/?confirm_email=2&param_list__gender__id_c='+filter_gender+'&param_list__age='+params.age+
          '&param_list__growth='+params.growth+'&param_list__clothsize='+params.clothsize+
          '&param_list__chestsize='+params.chestsize+'&param_list__waistsize='+params.waistsize+
          '&param_list__thighsize='+params.thighsize+'&param_list__footsize='+params.footsize+
          '&param_list__necksize='+params.necksize+'&param_list__headsize='+params.headsize+
          '&param_list__tatu='+params.tatu+'&param_list__piercing='+params.piercing+
          '&param_list__appearancetype_id='+params.appearancetype+'&param_list__haircolor_id='+params.haircolor+
          '&param_list__city_id='+params.city+'&param_list__employmenttype__id='+params.employmenttype +
          '&param_list__eyecolor_id='+params.eyecolor +
          '&ordering=-'+filter_order+'&search='+filter_search +
          '&limit=' + this.limit + '&offset=' + offset;
        return this.httpService.getEmploees(url).subscribe(data => {
          this.employees = data[1];
          console.log(this.employees);
          this.next = data[0];
          for (let itemEml of this.employees){
            this.emplList.push(itemEml);
          }
        });
    }

    change_order(param: string){
      this.offset = 0;
      this.emplList = [];
        if (param == 'date'){
            this.active_order = true;
            this.filter_order = 'date_joined';
            this.get_content(this.filter_gender, this.filter_order, this.filter_search, this.searchparameters, this.offset);
        }
        else if (param == 'rating'){
            this.active_order = false;
            this.filter_order = 'rating';
            this.get_content(this.filter_gender, this.filter_order, this.filter_search, this.searchparameters, this.offset);
        }
    }
    change_gender(gender_id:string){
      this.offset = 0;
      this.emplList = [];
        if (gender_id == "0"){
            this.gender_id = "0";
            this.filter_gender = "";
        }
        else {
            this.gender_id = gender_id;
            this.filter_gender = gender_id;
        }
        this.get_content(this.filter_gender, this.filter_order, this.filter_search, this.searchparameters, this.offset);
    }
    search(filter_search:string){
      this.offset = 0;
      this.emplList = [];
        this.filter_search = filter_search;
        this.get_content(this.filter_gender, this.filter_order, this.filter_search, this.searchparameters, this.offset);
    }
    inviteActive(employee_id: number){
      this.invite_employee_id = employee_id;
      this.invite_active = true;
    }
    inviteDeactive(){
      this.invite_active = false;
    }
    toggleBigSearch(){
      this.bigsearch = !this.bigsearch;
    }
    searchGlobalFilter(params: ParametersCreate, tatu: boolean, piercing: boolean){
      this.emplList = [];
        this.searchparameters = params;
        for (let item in this.searchparameters){
          if (this.searchparameters[item] == null){
            this.searchparameters[item] = '';
          }
        }
        if (tatu) {
          this.searchparameters.tatu = '2';
        }
        else{
          this.searchparameters.tatu = '1';
        }
        if (piercing) {
          this.searchparameters.piercing = '2';
        }
        else{
          this.searchparameters.piercing = '1';
        }
        this.get_content(this.filter_gender, this.filter_order, this.filter_search, this.searchparameters, this.offset);
    }
    more() {
      this.offset += this.limit;
      this.get_content(this.filter_gender, this.filter_order, this.filter_search, this.searchparameters,  this.offset);
    }
    notifi_emit(){
      this.invisible = true;
      setTimeout(() => {
          this.invisible = false;
        },
        2000);
    }
}
