import {Component, OnInit, Input} from "@angular/core";
import {ParametersDetail} from "../../models/parametersDetail";
import {Appearancetype} from "../../models/appearancetype";
import {ParametersService} from "../../services/parameters.service";
import {City} from "../../models/city";
import {Country} from "../../models/country";
import {Haircolor} from "../../models/haircolor";
import {Gender} from "../../models/gender";
import {Eyecolor} from "../../models/eyecolor";
import {Employmenttype} from "../../models/employmenttype";
import {RoleCreate} from "../../models/roleCreate";
import {CreateRoleService} from "../../services/create-role.service";
import {ParametersCreate} from "../../models/parametersCreate";
import {host} from "../../config";
import {CastingDetailComponent} from "../casting-detail/casting-detail.component";
import {RoleService} from "app/services/role.service";
import {RoleUpdate} from "../../models/roleUpdate";


@Component({
    selector: 'edit-role-app',
    styleUrls: ['./edit-role.component.css'],
    templateUrl: './edit-role.component.html',
    providers: [ParametersService, RoleService]
})

export  class  EditRoleComponent implements OnInit{
    @Input() role_id: number;
    roleData: any;
    roleUpdate: RoleUpdate = new RoleUpdate;
    roleParameters: any;
    haircolors: Haircolor[] = [];
    employmenttypes: Employmenttype[] = [];
    genders: Gender[] = [];
    eyecolors: Eyecolor[] =[];
    citys: City[] = [];
    appearancetypes: Appearancetype[] = [];
    paramrole_id: number;
    employmenttype_elem: number;
    constructor( private httpService: ParametersService,
                 private roleSerivce: RoleService,
                 private castingComponent: CastingDetailComponent) {}

    ngOnInit() {
        this.roleSerivce.getRole(host+'role/' + this.role_id + '/').subscribe(data => {
          this.roleData = data;
          this.httpService.getParameters(this.roleData.parameters).subscribe(data => {
            this.roleParameters = data;
            this.fillNewParam(this.roleUpdate, this.roleData, this.roleParameters);
          });
        });
        this.httpService.getHaircolor(host+'haircolor/').subscribe(data => this.haircolors=data);
        this.httpService.getGender(host+'gender/').subscribe(data => this.genders=data);
        this.httpService.getEyecolor(host+'eyecolor/').subscribe(data => this.eyecolors=data);
        this.httpService.getCity(host+'city/').subscribe(data => this.citys=data);
        this.httpService.getAppearancetype(host+'appearancetype/').subscribe(data => this.appearancetypes=data);
        this.httpService.getEmploymenttype(host+'employmenttype/').subscribe(data => this.employmenttypes=data);
    }
    submit(roleUpdate: RoleUpdate){
        this.roleSerivce.updateRole(roleUpdate, host+'update_role/' + this.role_id + '/').subscribe(
            data=>{
              this.castingComponent.role_updating();
            }
        )

    }
    fillNewParam(roleUpdate, roleData, roleParameters){
      if (roleData) {
        roleUpdate.name = roleData.name;
        roleUpdate.price = roleData.salary;
      }
      if (roleParameters){
        roleUpdate.age = roleParameters.age;
        roleUpdate.growth = roleParameters.growth;
        roleUpdate.clothsize = roleParameters.clothsize;
        roleUpdate.chestsize = roleParameters.chestsize;
        roleUpdate.waistsize = roleParameters.waistsize;
        roleUpdate.thighsize = roleParameters.thighsize;
        roleUpdate.footsize = roleParameters.footsize;
        roleUpdate.necksize = roleParameters.necksize;
        roleUpdate.headsize = roleParameters.headsize;
        roleUpdate.tatu = roleParameters.tatu;
        roleUpdate.piercing = roleParameters.piercing;
        roleUpdate.appearancetype = roleParameters.appearancetype.id;
        roleUpdate.haircolor = roleParameters.haircolor.id;
        roleUpdate.city = roleParameters.city.id;
        roleUpdate.eyecolor = roleParameters.eyecolor.id;
        roleUpdate.gender = roleParameters.gender.id;
        roleUpdate.employmenttype = roleParameters.employmenttype.id;
      }
    }
}

