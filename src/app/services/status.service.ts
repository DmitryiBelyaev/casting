import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Status} from "../models/status";
import {Observable} from "rxjs/Observable";


@Injectable()
export class StatusService {
    constructor(private http: HttpClient){}
    getStatus(url:string){
    return this.http.get(url)
    }

    putStatus(status: number, url: string){
        const body = {status_id: status};
        console.log(body);
        return this.http.put(url, body);
    }

}
