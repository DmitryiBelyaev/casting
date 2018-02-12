import { Component, OnInit} from '@angular/core';
import {Role} from "../../models/role";
import {RoleListService} from "../../services/role-list.service";
import {CastingDetailService} from "../../services/casting-detail.service";
import {Casting} from "../../models/casting";
import {ParametersService} from "../../services/parameters.service";
import {ParametersDetail} from "../../models/parametersDetail";
import {ActivatedRoute} from "@angular/router";
import {RequestCreate} from "../../models/requestCreate";
import {ParamRole} from "../../models/param-role";
import {host} from "../../config";
import {Haircolor} from "../../models/haircolor";
import {Employmenttype} from "../../models/employmenttype";
import {Gender} from "../../models/gender";
import {Eyecolor} from "../../models/eyecolor";
import {City} from "../../models/city";
import {Appearancetype} from "../../models/appearancetype";
import {ParametersCreate} from "../../models/parametersCreate";

@Component({
    selector: 'role-list-app',
    templateUrl: './role-list.component.html',
    styleUrls: ['./role-list.component.css'],
    providers: [RoleListService, CastingDetailService, ParametersService]
})
export class RoleListComponent implements OnInit{

    // visibility: boolean[] = [];
    // toggle(i: number){
    //     this.visibility[i]=!this.visibility[i];
    // }
    host = host;
    type_id: string = "0";
    filter_search:string = "";
    filter_type:string = "";
    role_list: any;
    castingDetail: Casting;
    parametersDetail: ParamRole;
    user_id: string = localStorage.getItem('user_id');
    id: string;
    searchparameters: ParametersCreate = new ParametersCreate();
    haircolors: Haircolor[] = [];
    employmenttypes: Employmenttype[] = [];
    genders: Gender[] = [];
    eyecolors: Eyecolor[] =[];
    citys: City[] = [];
    appearancetypes: Appearancetype[] = [];
    tatu: boolean = false;
    piercing: boolean = false;
    check: boolean = false;
    bigsearch: boolean = false;
    next: any;
    limit: number = 6;
    offset:number = 0;
    roleList: any[] = [];
    constructor(private httpService: RoleListService,
                private castingDetailService: CastingDetailService,
                private parametersService: ParametersService){
    }

    get_content(filter_type:string, filter_search:string, params: any, offset: number){
        let url: string = host+'role/?casting__type__type_id='+'&casting__status=2'+'&status=2'+filter_type+'&parameters__age='+params.age+
          '&parameters__growth='+params.growth+'&parameters__clothsize='+params.clothsize+
          '&parameters__chestsize='+params.chestsize+'&parameters__waistsize='+params.waistsize+
          '&parameters__thighsize='+params.thighsize+'&parameters__footsize='+params.footsize+
          '&parameters__necksize='+params.necksize+'&parameters__headsize='+params.headsize+
          '&parameters__tatu='+params.tatu+'&parameters__piercing='+params.piercing+
          '&parameters__appearancetype_id='+params.appearancetype+'&parameters__haircolor_id='+params.haircolor+
          '&parameters__city_id='+params.city+'&parameters__employmenttype__id='+params.employmenttype+
          '&parameters__eyecolor_id='+params.eyecolor+'&search='+filter_search +
          '&limit=' + this.limit + '&offset=' + offset;
        return this.httpService.getRoleList(url).subscribe(data => {
          this.role_list = data[1];
          this.next = data[0];
            for (let role of this.role_list){
                this.castingDetailService.getDetail(role.casting).subscribe((castdata:Casting) => {
                    this.castingDetail = castdata;
                    role['casting'] = this.castingDetail;
                // });
                // if (role['parameters'] != null) {
                //     this.parametersService.getParameters(role['parameters']).subscribe((paramdata:ParamRole) => {
                //         this.parametersDetail = paramdata;
                //         console.log('params', this.parametersDetail);
                //         role['parameters'] = this.parametersDetail;
                   this.roleList.push(role);
                    });
                // }
            }
        });
    }

    ngOnInit(){
        for (let item in this.searchparameters){
          this.searchparameters[item] = '';
        }
        this.get_content(this.filter_type, this.filter_search, this.searchparameters, this.offset);
        this.parametersService.getHaircolor(host+'haircolor/').subscribe(data => this.haircolors=data);
        this.parametersService.getGender(host+'gender/').subscribe(data => this.genders=data);
        this.parametersService.getEyecolor(host+'eyecolor/').subscribe(data => this.eyecolors=data);
        this.parametersService.getCity(host+'city/').subscribe(data => this.citys=data);
        this.parametersService.getAppearancetype(host+'appearancetype/').subscribe(data => this.appearancetypes=data);
        this.parametersService.getEmploymenttype(host+'employmenttype/').subscribe(data => this.employmenttypes=data);
    }

    change_type(type_id:string){
      this.offset = 0;
      this.roleList = [];
        if (type_id == "0"){
            this.type_id = "0";
            this.filter_type = "";
        }
        else {
            this.type_id = type_id;
            this.filter_type = type_id;
        }
        this.get_content(this.filter_type, this.filter_search, this.searchparameters, this.offset);
    }
    search(filter_search:string){
      this.offset = 0;
      this.roleList = [];
        this.filter_search = filter_search;
        this.get_content(this.filter_type, this.filter_search, this.searchparameters, this.offset);
    }
    toggleBigSearch(){
      this.bigsearch = !this.bigsearch;
    }
    searchGlobalFilter(params: ParametersCreate, tatu: boolean, piercing: boolean){
      this.offset = 0;
      this.roleList = [];
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
      this.get_content(this.filter_type, this.filter_search, this.searchparameters, this.offset);
    }
    more() {
      this.offset += this.limit;
      this.get_content(this.filter_type, this.filter_search, this.searchparameters, this.offset);
    }
}
