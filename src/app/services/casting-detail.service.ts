import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from "rxjs/Observable";
import {CastingType} from "../models/casting-type";

@Injectable()
export class CastingDetailService{

    constructor(private http: HttpClient){ }

  getCastingTypes(url: string) : Observable<CastingType[]> {
      return this.http.get(url).map(data=>{
        let usersList = data;
        if (usersList instanceof Array) {
          return usersList.map(function (castingType: any) {
            return {name: castingType.name, type_id: castingType.type_id};
          });
        }
      });
    }
    getDetail(url: string){
        return this.http.get(url);
    }
    getType(url:string){
        return this.http.get(url);
    }
    getOwner(url:string){
        return this.http.get(url);
    }
    changeStatusCasting(status: boolean, url: string){
      const body = {
        status: status,
      };
      return this.http.put(url, body);
    }
}
