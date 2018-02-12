import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class EmployeeProfileService{

    constructor(public http: HttpClient){ }

    getEmployee(url: string){
        return this.http.get(url);
    }
    putImgEmployee(formData: FormData, url:string){
      const body = formData;
      console.log('body', body);
      return this.http.post(url, body);
    }
    putPhotoEmployee(formData: FormData, url:string){
      const body = formData;
      console.log('body', body);
      return this.http.post(url, body);
    }
}
