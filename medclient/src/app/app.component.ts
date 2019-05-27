import {Component} from '@angular/core';
import {SocketService} from './services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private mss: SocketService) {
  }

  notificationsOptions = {
    position: ['top', 'right'],
    timeOut: 5000,
    showProgressBar: false,
    theClass: 'app-notification'
  };

  title = 'Диспетчерская СМП';
}
