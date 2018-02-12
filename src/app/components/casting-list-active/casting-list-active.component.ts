import {Casting} from "../../models/casting";
import {Component, OnInit} from "@angular/core";
import {CastingListService} from "../../services/casting-list.service";
import {CastingDetailService} from "../../services/casting-detail.service";
import {CastingType} from "../../models/casting-type";
import {RoleService} from "../../services/role.service";
import {Role} from "../../models/role";
import {host} from "../../config";
import {PluralPipe} from "../../pipes/plural.pipe";

@Component({
    selector: 'casting-list-active-app',
    templateUrl: './casting-list-active.component.html',
    providers: [CastingListService, CastingDetailService, RoleService],
    styleUrls: ['../casting-list/casting-list.component.css']
})

export class CastingListAcitveComponent implements OnInit{
    host = host;
    castingInfos: any;
    castingType:  CastingType;
    user_id = localStorage.getItem('user_id');
    role: Role = new Role;
    role_list: Role[] = [];
    bababa = 'aaaaaaaaaaaaaaaaad'
    constructor(private httpService: CastingListService,
                private castingDetailService: CastingDetailService,
                private roleService: RoleService){}

    ngOnInit(){
      console.log(this.bababa.substr(-1), 'subsrt');
        this.httpService.getCasting(host+"castinglist/?status=true&owner_id="+this.user_id+'&limit=20').subscribe(data=> {
            this.castingInfos = data[1];
            for (let item of this.castingInfos){
                console.log('adres', item);
                this.castingDetailService.getType(item.type).subscribe((data: CastingType)=>{
                    this.castingType = data;
                    item['type'] = this.castingType.name;
                });
            }
        });
    }
}
