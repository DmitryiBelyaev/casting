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
import {Casting} from "../../models/casting";
import {ParametersCreate} from "../../models/parametersCreate";
import {host} from "../../config";
import {CastingDetailComponent} from "../casting-detail/casting-detail.component";


@Component({
    selector: 'create-role-app',
    styleUrls: ['./create-role.component.css'],
    templateUrl: './create-role.component.html',
    providers: [CreateRoleService, ParametersService]
})

export  class  CreateRoleComponent implements OnInit{
    @Input() casting_id: number;
    haircolors: Haircolor[] = [];
    employmenttypes: Employmenttype[] = [];
    genders: Gender[] = [];
    eyecolors: Eyecolor[] =[];
    citys: City[] = [];
    appearancetypes: Appearancetype[] = [];
    role_id: number;
    paramrole_id: number;
    employmenttype_elem: number;
    parameters: ParametersCreate = new ParametersCreate();
    new_role: RoleCreate = new RoleCreate();
    constructor( private castingService: CreateRoleService,
                 private httpService: ParametersService,
                 private castingComponent: CastingDetailComponent) {}

    ngOnInit() {
        this.httpService.getHaircolor(host+'haircolor/').subscribe(data => this.haircolors=data);
        this.httpService.getGender(host+'gender/').subscribe(data => this.genders=data);
        this.httpService.getEyecolor(host+'eyecolor/').subscribe(data => this.eyecolors=data);
        this.httpService.getCity(host+'city/').subscribe(data => this.citys=data);
        this.httpService.getAppearancetype(host+'appearancetype/').subscribe(data => this.appearancetypes=data);
        this.httpService.getEmploymenttype(host+'employmenttype/').subscribe(data => this.employmenttypes=data);
        this.parameters.tatu = false;
        this.parameters.piercing = false;
        this.new_role.casting_id = this.casting_id;
    }
    submit(parameters: ParametersCreate, createrole: RoleCreate){
        this.castingService.postRole(createrole, host+'new_role/').subscribe(
            data=>{
                this.role_id = data["role_id"];
                this.castingService.postParameter(parameters, this.role_id, host+'new_paramrole/').subscribe(
                    data => {
                      this.paramrole_id=data['paramrole_id'];
                      this.castingComponent.role_adding();
                    }
                    );
            }
        )

    }
}

