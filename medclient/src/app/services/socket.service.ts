import {Inject, Injectable} from '@angular/core';
import {UserService} from './user.service';
import {RxStomp} from '@stomp/rx-stomp';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {StompState} from '@stomp/ng2-stompjs';
import {API_BASE_URL} from '../../../swagger/med-api.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  /**
   * CLOSED - закрыто, TRYING - стучится (налажено)
   */
  public state$: Observable<string>;
  state = 'CLOSED';
  rxStomp: RxStomp;
  baseURL: string;

  constructor(private us: UserService, @Inject(API_BASE_URL) baseURL: string) {
    this.baseURL = baseURL.slice(7);
    // this.us.authSub.asObservable().subscribe((res) => {
    //   if (this.state === 'CLOSED' && res) {
    //     this.connectToSocket();
    //   }
    // });
  }

  connectToSocket() {
    if (this.state === 'CLOSED') {
      this.state = '_CUSTOM_TRYING_';
      this.rxStomp = new RxStomp();
      this.rxStomp.configure(
        {
          // brokerURL: 'ws://172.16.6.166/tcmk/api/stomp',
          brokerURL: 'ws://' + this.baseURL+ '/api/stomp',
          heartbeatIncoming: 0,
          heartbeatOutgoing: 20000,
          reconnectDelay: 500,
          debug: (msg: string) => {
            // console.log('stomp', new Date(), msg);
          },
          connectHeaders: {
            login: this.us.token,
          }
        }
      );
      this.rxStomp.activate();
      this.state$ = this.rxStomp.connectionState$.pipe(map((state: number) => {
        this.state = StompState[state];
        return this.state;
      }));

    }
  }

  watchTopic(topic: string): Observable<any> {
    return this.rxStomp.watch('/topic/' + topic);
  }
}
