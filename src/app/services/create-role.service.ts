import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {Casting} from "../models/casting";
import {RoleCreate} from "../models/roleCreate";
import {ParametersCreate} from "../models/parametersCreate";


@Injectable()
export class CreateRoleService {

    constructor(private http: HttpClient) {
    }

    getCasting(url:string): Observable<Casting[]> {
        return this.http.get(url).map(data => {
            let usersList = data;
            if (usersList instanceof Array) {
                return usersList.map(function (casting: any) {
                    return {
                        url: casting.url,
                        id: casting.id,
                        name: casting.name,
                        type: casting.type,
                        description: casting.description,
                        owner: casting.owner,
                        image: casting.image,
                        date: casting.date,
                        time: casting.time,
                        role_set: casting.role_set,
                        address: casting.address,
                        metro: casting.metro,
                        status: casting.status,
                    };
                });
            }
        });
    }

    postRole(createrole: RoleCreate, url:string) {
        const body = {
            name: createrole.name,
            salary: createrole.salary,
            casting_id: createrole.casting_id,
        };
        console.log(body);
        return this.http.post(url, body);
    }

    postParameter(parameters: ParametersCreate, role_id: number, url: string) {
        const body = {
            role_id: role_id,
            age: parameters.age,
            growth: parameters.growth,
            clothsize: parameters.clothsize,
            chestsize: parameters.chestsize,
            waistsize: parameters.waistsize,
            thighsize: parameters.thighsize,
            footsize: parameters.footsize,
            necksize: parameters.necksize,
            headsize: parameters.headsize,
            tatu: parameters.tatu,
            piercing: parameters.piercing,
            appearancetype: parameters.appearancetype,
            haircolor: parameters.haircolor,
            city: parameters.city,
            eyecolor: parameters.eyecolor,
            gender: parameters.gender,
            employmenttype: parameters.employmenttype
        };
        console.log(body);
        return this.http.post(url, body);
    }
}
