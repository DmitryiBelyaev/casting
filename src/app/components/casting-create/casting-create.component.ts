import {Component, OnInit} from "@angular/core";
import {CastingCreateService} from "../../services/casting-create.service";
import { host } from "../../config";
import {CastingUpdateCreate} from "../../models/castingUpdateCreate";
import {Router} from '@angular/router';


@Component({
    template: `<div></div>`,
    selector: 'casting-create-app',
    providers: [CastingCreateService]
})


export class CastingCreateComponent implements OnInit{
    newCasting: CastingUpdateCreate = new CastingUpdateCreate();
    casting_id: any;
    user_id = localStorage.getItem('user_id');
constructor(private httpService: CastingCreateService,
            private router: Router,) {}

    ngOnInit() {
      this.create_casting();
    }
    create_casting() {
        this.newCasting.owner = this.user_id;
        this.httpService.postCasting( this.newCasting, host + 'new_casting/')
            .subscribe(
                data => {
                  this.casting_id = data['casting_id'];
                  this.router.navigate(['/employer/castingDetail', this.casting_id]
                    ,{
                    queryParams:{
                      'edit': true,
                    }
                  });
                },
            );
    }
}
