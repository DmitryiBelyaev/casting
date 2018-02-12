import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Invite} from "../models/invite";
import {Observable} from "rxjs/Observable";

@Injectable()
export class InvaiteListService{
    constructor(private http: HttpClient){ }

    getInviteLists(url: string) : Observable<Invite[]> {
        return this.http.get(url).map(data=>{
            let roleList = data['results'];
            let next = data['next'];
            let results: any[];
            if (roleList instanceof Array) {
                results = roleList.map(function (invite: any) {
                    return {url: invite.url,
                        creation_date: invite.creation_date,
                        employee: invite.employee,
                        employer: invite.employer,
                        status: invite.status,
                        id: invite.id,
                        role: invite.role};
                });
              return [next, results];
            }
        });
    }
}
