import {Casting} from "../../models/casting";
import {Component, OnInit} from "@angular/core";
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import {CastingType} from "../../models/casting-type";
import {Employer} from "../../models/employer";
import {CastingDetailService} from "../../services/casting-detail.service";
import { ActivatedRoute} from '@angular/router';
import {Role} from "../../models/role";
import {RoleService} from "../../services/role.service";
import {host} from "../../config";
import {RequestListService} from "../../services/request-list.service";
import {EmployeeDetailService} from "../../services/employee-detail.service";
import {RequestDetail} from "../../models/requestDetail";
import {CastingListService} from "../../services/casting-list.service";
import {CastingUpdateCreate} from "../../models/castingUpdateCreate";
import {CastingCreateService} from "../../services/casting-create.service";
import {Subscription} from 'rxjs/Subscription';
import {trigger, state, style, animate, transition} from '@angular/animations';


@Component({
    selector: 'casting-detail-app',
    styleUrls:['./casting-detail.component.css'],
    templateUrl:'./casting-detail.component.html',
    providers: [CastingListService,RoleService,RequestListService,EmployeeDetailService,CastingDetailService,CastingCreateService]
})

export class CastingDetailComponent implements OnInit{
    host = host;
    id: number;
    update: boolean = false;
    update_role: boolean = false;
    update_role_id: number;
    castDetail: Casting;
    castType: CastingType;
    castingTypes: CastingType[]= [];
    castOwner: Employer;
    role:Role;
    requests:RequestDetail[]=[];
    castingList: Casting[];
    castingUpdate: CastingUpdateCreate = new CastingUpdateCreate;
    castingData: any[] = [];
    check: boolean = true;
    user_id: string = localStorage.getItem('user_id');
    CurrentFile: File;
    imageSource: string;
    formData: FormData = new FormData();
    roleform_check:boolean = false;
    map_address = '';
    map_url: SafeResourceUrl;
    map_query = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyACh86K7LB5yBNCIjfvwlJUi2IMhWKAiL0&q=';
    check_role: boolean = false;


    constructor(private castingListService: CastingListService,
                private activateRoute: ActivatedRoute,
                private roleService: RoleService,
                private requestService: RequestListService,
                private employeeDetailService: EmployeeDetailService,
                private httpService: CastingDetailService,
                private updateCreateCastingService: CastingCreateService,
                private sanitizer: DomSanitizer,){
        // this.routeSubscription = activateRoute.params.subscribe(params => this.id = params['id']);
        // this.querySubscription = activateRoute.queryParams.subscribe(
        //   (queryParam: any) => {
        //     this.update = queryParam['edit'];
        //   });
        this.id = activateRoute.snapshot.params['id'];
        this.update = activateRoute.snapshot.queryParams['edit'];
    }
    func(castingItem: any){
        for (let item_role in castingItem.role_set) {
            this.roleService.getRole(castingItem.role_set[item_role]).subscribe(datarole => {
                castingItem.role_set[item_role] = datarole;
                this.requestService.getRequestLists(host + 'request/?role_id=' + castingItem.role_set[item_role]['id']).subscribe(datarequest => {
                    castingItem.role_set[item_role]['requests'] = datarequest;
                    for (let item_request in castingItem.role_set[item_role]['requests']){
                        this.employeeDetailService.getEmployee(castingItem.role_set[item_role]['requests'][item_request].employee).subscribe(dataemployee => {
                            castingItem.role_set[item_role]['requests'][item_request]['employee_data'] = dataemployee;
                        });
                    }
                });
            });
        }
        return castingItem;
    }
    init_def(){
      this.httpService.getDetail(host+'castinglist/'+this.id.toString()+ '/').subscribe((data: Casting) => {
        this.castDetail = data;
        this.castingData = this.func(this.castDetail);
        if (this.castingData['role_set'].length > 0){
         this.check_role = true;
        }
        this.httpService.getType(this.castDetail.type).subscribe((data:CastingType) => this.castType=data);
        this.httpService.getOwner(this.castDetail.owner).subscribe((data:Employer) => this.castOwner=data);
        this.updateCastingValue();
        this.get_map_url(this.castDetail.address);
      });
    }

    ngOnInit(){
      this.init_def();
      this.httpService.getCastingTypes(host + 'castingtype/').subscribe((datatype) => { this.castingTypes = datatype; } );
    }

    updatecasting() {
      this.update = !this.update;
      this.update_role = false;
    }
    updaterole(role_id) {
      this.update_role_id = role_id;
      this.update_role = !this.update_role;
    }
    hideupdaterole(){
      this.update_role = !this.update_role;
    }

    updateCastingValue(){
      this.castingUpdate.name = this.castDetail.name;
      this.castingUpdate.description = this.castDetail.description;
      this.castingUpdate.date = this.castDetail.date;
      this.castingUpdate.time = this.castDetail.time;
      this.castingUpdate.metro = this.castDetail.metro;
      this.castingUpdate.address = this.castDetail.address;
      this.castingUpdate.type = this.castType.type_id;
    }
    save_change(castingUpdate: CastingUpdateCreate) {
        this.updateCreateCastingService.putCasting(castingUpdate,host+'casting_update/'+this.id+'/').subscribe(data => {
          this.ngOnInit();
          this.updatecasting();
        });
    }
    public FileChangeEvent(fileInput: any){
      this.CurrentFile = fileInput.target.files[0];
      this.formData.append( 'name', this.CurrentFile.name);

      let reader = new FileReader();
      reader.onload = () => {
        this.imageSource = reader.result;
        this.formData.append('image', this.CurrentFile);
        this.updateCreateCastingService.putImgCasting(this.formData, host+'new_img_casting/' + this.id + '/')
          .subscribe(
            data => {
              // this.castDetail.image = data['image_url'];
              this.ngOnInit();
            },
            error => console.log(error)
          );
      };
      reader.readAsDataURL(this.CurrentFile);
    }
    get_map_url(address:string){
      this.map_address = address.replace(/\s/gi, '+');
      this.map_url = this.sanitizer.bypassSecurityTrustResourceUrl(this.map_query + this.map_address);
    }
    open_close_role_form(){
      this.roleform_check = !this.roleform_check;
    }
    role_adding(){
      this.open_close_role_form();
      this.init_def();
    }
    role_updating(){
      this.hideupdaterole();
      this.init_def();
    }
    changeStatusRole(id, flag: number){
      if (flag === 0) {
        this.roleService.changeStatusRole(false, host + 'changeStatusRole/' + id + '/').subscribe(res =>{
          this.init_def();
        });
      } else {
        this.roleService.changeStatusRole(true, host + 'changeStatusRole/' + id + '/').subscribe(res =>{
          this.init_def();
        });
      }
    }
  changeStatusCasting(flag: number){
      if (flag === 0) {
        this.httpService.changeStatusCasting(false, host + 'changeStatusCasting/' + this.id + '/').subscribe(res =>{
          this.init_def();
        });
      } else {
        this.httpService.changeStatusCasting(true, host + 'changeStatusCasting/' + this.id + '/').subscribe(res =>{
          this.init_def();
        });
      }
    }
}

