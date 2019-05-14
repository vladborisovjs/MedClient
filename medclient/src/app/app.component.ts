import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  notificationsOptions = {
    position: ['top', 'right'],
    timeOut: 5000,
    showProgressBar: false,
    theClass: 'app-notification'
  };

  title = 'Диспетчерская СМП';
}
