import {Component, OnDestroy, OnInit} from '@angular/core';
import {SocketService} from "../../../../services/socket.service";
import {UserService} from "../../../../services/user.service";
import {SocketTopicsService} from "../../services/socket-topics.service";


@Component({
  selector: 'app-socket-control',
  templateUrl: './socket-control.component.html',
  styleUrls: ['./socket-control.component.scss']
})
export class SocketControlComponent implements OnInit, OnDestroy {


  constructor(public ss: SocketService,
              private sTopics: SocketTopicsService,
              public user: UserService) { }

  ngOnInit() {
    this.sTopics.initMainSubscriptions(); // открываем подписки с модалками
  }

  test(){

  }

  ngOnDestroy(){
    this.sTopics.closeMainSubscriptions(); // зфкрываем подписки с модалками
  }

}
