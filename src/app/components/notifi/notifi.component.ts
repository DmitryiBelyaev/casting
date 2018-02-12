import {Component, OnInit, Input} from "@angular/core";
import {RequestListService} from "../../services/request-list.service";
import {host} from "../../config";
import {NotificationService} from "../../services/notification.service";
import {Router} from "@angular/router";


@Component({
  selector:'notifi-app',
  templateUrl:'./notifi.component.html',
  styleUrls: ['notifi.component.css'],
  providers: [NotificationService,],
//   animations: [
//     trigger('toggleState', [
//       state('true' , style({opacity: 1})),
//       state('false', style({ maxHeight: 0, padding: 0, display: 'none', opacity: 0})),
//       transition('0 => 1', animate('100ms ease-in')),
//       transition('1 => 0', animate('100ms ease-out')),
//     ]),
// ],
})

export class NotifiComponent implements OnInit{
  // @Input() shouldToggle;
  @Input() target: boolean;
  today: Date = new Date;
  host = host;
  limit: number = 10;
  url = '';
  next: any;
  notifications: any;
  notificationSlice: any;
  user_id = localStorage.getItem('user_id');
  constructor(private notificationSerivce: NotificationService, private router: Router){}

  ngOnInit() {
    this.getData();
    this.updateData();
  }
  updateData(){
    setTimeout(() => {
        this.getData();
        // this.updateData();
      },
      5000);
  }
  getData(){
    if (this.target) {
      this.url = this.host + 'notifi/?' + 'employee_id=' + this.user_id + '&limit=10/';
    } else {
      this.url = this.host + 'notifi/?' + 'employer_id=' + this.user_id + '&limit=10/';
    }
    this.notificationSerivce.getNotifications(this.url).subscribe(data => {
      this.notifications = data;
      this.notificationSlice = this.notifications.slice(0, 6);
    });
  }
  delete_notifi(id) {
    this.notificationSerivce.deleteNotification(host + 'notifi/' + id + '/').subscribe(data => {
      this.getData();
    });
  }
  go_casting(id){
    this.router.navigate(['/employee/castingDetail', id]);
  }
}
