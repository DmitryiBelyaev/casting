import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {CastingType} from "../models/casting-type";
import {Observable} from "rxjs/Observable";
import {Casting} from "../models/casting";
import {CastingUpdateCreate} from "../models/castingUpdateCreate";


@Injectable()
export  class CastingCreateService {
    constructor(private http: HttpClient){ }
    getCasting_Type(url: string) : Observable<CastingType[]> {
      return this.http.get(url).map(data=>{
        let usersList = data;
        if (usersList instanceof Array) {
          return usersList.map(function (castingType: any) {
            return {name: castingType.name, type_id: castingType.type_id};
          });
        }
      });
    }
    postCasting(data: CastingUpdateCreate, url: string) {
        const body = {
          owner: data.owner,
        };
        console.log(body);
        return this.http.post(url, body);
    }

    putCasting(updateCasting: CastingUpdateCreate, url:string){
      const body = {
        name: updateCasting.name,
        description: updateCasting.description,
        type: updateCasting.type,
        metro: updateCasting.metro,
        address: updateCasting.address,
        date: updateCasting.date,
        time: updateCasting.time,
      };
      return this.http.put(url, body);
    }

    putImgCasting(formData: FormData, url:string){
      const body = formData;
      console.log('body', body);
      return this.http.post(url, body);
    }
}
