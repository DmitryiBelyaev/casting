import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class PollsService{
  constructor(private http: HttpClient){ }

  getVoice(url: string){
    return this.http.get(url);
  }
  postVoice(voice, user_id: string, url: string) {
    const body = {
      employer_id: user_id,
      voice: voice,
    };
    console.log(body);
    return this.http.post(url, body);
  }
}
