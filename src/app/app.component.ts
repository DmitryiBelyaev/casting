import { Component, OnInit} from '@angular/core';
import { HttpService} from './http.service';

@Component({
    selector: 'my-app',
    template: `
                <router-outlet></router-outlet>
                `,
    styleUrls: ['./app.component.css'],
    providers: [HttpService],
})
export class AppComponent {

}
