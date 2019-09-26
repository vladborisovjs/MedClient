import { Component, OnInit } from '@angular/core';
import {FireMessagingService} from '../../services/fire-messaging.service';

@Component({
  selector: 'app-push-control',
  templateUrl: './push-control.component.html',
  styleUrls: ['./push-control.component.scss']
})
export class PushControlComponent implements OnInit {

  constructor(public fireMess: FireMessagingService) { }

  ngOnInit() {
    this.fireMess.startListeningPushes()
  }

  testPush(){
    this.fireMess.testPush()
  }

  generateToken(){
    this.fireMess.generateToken()
  }


}
