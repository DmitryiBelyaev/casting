import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Casting} from "../models/casting";
import {Observable} from "rxjs/Observable";

@Injectable()
export class CastingListService {

    constructor(private http: HttpClient) {
    }

    getCasting(url: string) : Observable<Casting[]> {
      return this.http.get(url).map(data=>{
        let usersList = data['results'];
        let next = data['next'];
        let results: any[];
        if (usersList instanceof Array) {
          results = usersList.map(function (castingInfo: any) {
            return {url: castingInfo.url,
              id: castingInfo.id,
              name: castingInfo.name,
              image: castingInfo.image,
              description: castingInfo.description,
              type: castingInfo.type,
              owner: castingInfo.owner,
              date: castingInfo.date,
              role_set: castingInfo.role_set,
              address: castingInfo.address,
              time: castingInfo.time,
            };
          });
          return [next, results];
        }
      });
    }
    getCastingWithoutLimit(url: string) : Observable<Casting[]> {
      return this.http.get(url).map(data=>{
        let usersList = data;
        let results: any;
        if (usersList instanceof Array) {
          results = usersList.map(function (castingInfo: any) {
            return {url: castingInfo.url,
              id: castingInfo.id,
              name: castingInfo.name,
              image: castingInfo.image,
              description: castingInfo.description,
              type: castingInfo.type,
              owner: castingInfo.owner,
              date: castingInfo.date,
              role_set: castingInfo.role_set};
          });
          return results;
        }
      });
    }
    getCastingRequest(url: string){
      return this.http.get(url);
    }

}
