import {Inject, Injectable} from '@angular/core';
import {UserService} from './user.service';
import {API_BASE_URL} from '../../../swagger/med-api.service';
import * as SockJS from "sockjs-client";
import {CompatClient, IMessage, Stomp, StompSubscription} from '@stomp/stompjs';
import {RoleAccessService} from "./role-access.service";
import {ISocketTopic, SocketTopicsService} from "../shared/socket-topic/services/socket-topics.service";


@Injectable({
  providedIn: 'root'
})
export class SocketService {
  client: CompatClient;
  socketStatus: 'opened' | 'connecting' | 'closed' = 'closed';
  socketTopics = this.sTopics.socketTopics;
  topicsSubscriptions: StompSubscription[] = [];

  constructor(private us: UserService,
              private rs: RoleAccessService,
              private sTopics: SocketTopicsService,
              @Inject(API_BASE_URL) public apiUrl?: string) {
    this.connectJS();
  }


  connectJS() {
    this.client = Stomp.over(() => {
      this.socketStatus = 'connecting';
      return new SockJS(this.apiUrl + '/endpoint')
    });
    this.client.configure({
      reconnectDelay: 20000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
    });

    this.client.connect(
      {}, () => {
        this.socketStatus = 'opened';
        this.initStompSubscriptions();
      },
      (err) => {
        this.socketStatus = 'closed';
        console.log('ws err', err);
      },
      (closeEvent) => {
        this.socketStatus = 'closed';
        console.log(closeEvent);
      }
    );
  }

  initStompSubscriptions() {
    this.socketTopics.forEach(
      (topic: ISocketTopic) => {
        this.topicsSubscriptions.push(this.client.subscribe(topic.destination, topic.messageAction));
      }
    );
  }
}
