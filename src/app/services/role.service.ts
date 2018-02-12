import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {RoleUpdate} from "../models/roleUpdate";


@Injectable()
export class RoleService{
    constructor(private http: HttpClient){ }

    getRole(url: string){
        return this.http.get(url);
    }
    updateRole(roleUpdate: RoleUpdate, url: string){
    const body = {
      name : roleUpdate.name,
      salary : roleUpdate.price,
      age : roleUpdate.age,
      growth : roleUpdate.growth,
      clothsize : roleUpdate.clothsize,
      chestsize : roleUpdate.chestsize,
      waistsize : roleUpdate.waistsize,
      thighsize : roleUpdate.thighsize,
      footsize : roleUpdate.footsize,
      necksize : roleUpdate.necksize,
      headsize : roleUpdate.headsize,
      tatu : roleUpdate.tatu,
      piercing : roleUpdate.piercing,
      appearancetype : roleUpdate.appearancetype,
      haircolor : roleUpdate.haircolor,
      city : roleUpdate.city,
      eyecolor : roleUpdate.eyecolor,
      gender : roleUpdate.gender,
      employmenttype : roleUpdate.employmenttype,
    };
    return this.http.put(url, body);
  }

  changeStatusRole(status: boolean, url: string){
    const body = {
      status: status,
    };
    return this.http.put(url, body);
  }
}
