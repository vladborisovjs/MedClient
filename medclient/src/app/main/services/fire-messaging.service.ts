import { Injectable } from '@angular/core';
import {AngularFireMessaging} from '@angular/fire/messaging';
import {MedApi, PushTokenBean} from '../../../../swagger/med-api.service';
import {NotificationsService} from 'angular2-notifications';

@Injectable({
  providedIn: 'root'
})
export class FireMessagingService {

  token: PushTokenBean = PushTokenBean.fromJS({
    appVersion: '1',
    brigadeId: 6195,
    hash: 'hash1',
    manufacturer: 'Telda',
    model: 'lamborgini',
    os: 'win',
    osVersion: '95',
    token: ''
  });
  isListening = false;

  constructor(private afMessaging: AngularFireMessaging,
              private api: MedApi,
              private ns: NotificationsService) {
    this.afMessaging.messaging.subscribe(
      (_messaging) => {
        _messaging.onMessage = _messaging.onMessage.bind(_messaging);
        _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
      }
    )
  }

  startListeningPushes(){
    this.afMessaging.requestPermission.subscribe(
      () => {
        this.afMessaging.getToken.subscribe(
          tok => {
            this.token.token = tok;
            this.listenPushes();
          },
          err => {
            console.log('not tok', err);
          }
        );
      }
    );
  }


  listenPushes() {
    this.isListening = true;
    this.afMessaging.messages
      .subscribe((message: any) => {
        console.log('Push:', message);
        this.ns.warn('Push', message.notification)
      });
  }


  generateToken() {
    this.afMessaging.requestToken.subscribe(
      token => {
        this.token.token = token;
        this.api.createPushTokenUsingPOST(this.token).subscribe(
          s => {
            console.log(s);
          }
        );
      }

    );
  }

  testPush() {
    console.log('send test push');
    this.api.testNewCallNotificationUsingPOST(this.token.token).subscribe(
      ()=>{}
    );


  }




}
