import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {EmployerUpdate} from "../models/employerUpdate";


@Injectable()
export class EmployerProfileService{

    constructor(private http: HttpClient){}

    getCreator(url:string){
        return this.http.get(url)
    }
    putImgEmployer(formData: FormData, url:string){
      const body = formData;
      console.log('body', body);
      return this.http.post(url, body);
    }

    putNameEmployer(parametersUpdate: EmployerUpdate, url: string) {
      const body = {
        first_name: parametersUpdate.first_name,
        last_name: parametersUpdate.last_name,
      };
      return this.http.put(url, body);
    }
    postConfirm(code_confirm: string, user_id: string, url: string) {
      const body = {
        'code_confirm': code_confirm,
        'user_id': user_id,
      };
      console.log('body', body);
      return this.http.post(url, body);
    }
}
