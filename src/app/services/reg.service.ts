import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../models/user';

@Injectable()
export class RegService{

    constructor(private http: HttpClient){ }

    postDataEmployee(user: User, url: string){
        const body = {username: user.username, password: user.password, first_name: user.first_name, last_name: user.last_name, email: user.username};
        return this.http.post(url, body);
    }

    postDataEmployer(user: User, url: string){
        const body = {username: user.username, password: user.password, first_name: user.first_name, last_name: user.last_name, email: user.username};
        return this.http.post(url, body);
    }
}
