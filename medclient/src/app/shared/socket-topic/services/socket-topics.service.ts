import {Injectable} from '@angular/core';
import {_Roles} from "../../../models/user-roles";
import {IMessage, messageCallbackType} from "@stomp/stompjs";
import {Subject, Subscription} from "rxjs";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {ModalUkioIncomingComponent} from "../components/modal-ukio-incoming/modal-ukio-incoming.component";
import {UserService} from "../../../services/user.service";
import {Router} from "@angular/router";
import {MedApi} from "../../../../../swagger/med-api.service";
import {NotificationsService} from "angular2-notifications";
import {ModalIncomingAviationComponent} from "../components/modal-incoming-aviation/modal-incoming-aviation.component";
import {IncommingCallComponent} from "../components/modal-incoming-call/incomming-call.component";
import {filter} from "rxjs/operators";
import {RoleAccessService} from "../../../services/role-access.service";

export interface ISocketTopic {
  name?: string, // имя топика (для внутреннего использования в сервисе)
  destination: any, // на что подписываться
  messages?: any[],
  messageAction: messageCallbackType,
  roles?: _Roles[] // для каких ролей подключать
}

export interface IIncomingCallSocket {
  performerId: number,
  sessionId: string,
  fromNumber: string,
  ukio: any
}

export interface IukioSocket {
  callId: number,
  declarantPhone: number | string,
  ukioId: number | string,
  transferCall: boolean // привязан ли вызов к карточке укио
}

@Injectable({
  providedIn: 'root'
})
export class SocketTopicsService {

  brigadeAlarmSub: Subject<any> = new Subject();
  brigadeStatusSub: Subject<any> = new Subject();
  callIncomingSub: Subject<any> = new Subject();
  callProcessingSub: Subject<any> = new Subject();
  callTerminatedSub: Subject<any> = new Subject();
  callStatusSub: Subject<any> = new Subject();
  callUpdatedSub: Subject<any> = new Subject();
  aviationRequestSub: Subject<any> = new Subject();
  incomingUkioSub: Subject<any> = new Subject();
  updateUkioSub: Subject<any> = new Subject();

  socketTopics: ISocketTopic[] = [
    {
      destination: '/brigade/alarm/endpoint',
      messageAction: (message: IMessage) => {
        this.brigadeAlarmSub.next(JSON.parse(message.body))
      },
    },
    {
      destination: '/brigade/status/endpoint',
      messageAction: (message: IMessage) => {
        this.brigadeStatusSub.next(JSON.parse(message.body))
      },
    },
    {
      destination: '/call/incoming/endpoint',
      messageAction: (message: IMessage) => {
        this.callIncomingSub.next(JSON.parse(message.body))
      },
    },
    {
      destination: '/call/processing/endpoint',
      messageAction: (message: IMessage) => {
        this.callProcessingSub.next(JSON.parse(message.body));
        console.log(JSON.parse(message.body))
      },
    },
    {
      destination: '/call/terminated/endpoint',
      messageAction: (message: IMessage) => {
        this.callTerminatedSub.next(JSON.parse(message.body))
      },
    },
    {
      destination: '/call/status/endpoint',
      messageAction: (message: IMessage) => {
        this.callStatusSub.next(JSON.parse(message.body))
      },
    },
    {
      destination: '/call/update/endpoint',
      messageAction: (message: IMessage) => {
        this.callUpdatedSub.next(JSON.parse(message.body));
        console.log(JSON.parse(message.body));
      },
    },

    {
      destination: '/call/request/endpoint',
      messageAction: (message: IMessage) => {
        this.aviationRequestSub.next(JSON.parse(message.body))
      },
    },
    {
      destination: '/ukio/incoming/endpoint',
      messageAction: (message: IMessage) => {
        this.incomingUkioSub.next(JSON.parse(message.body));
        console.log('update ukio sub', JSON.parse(message.body));
      },
    },
    {
      destination: '/ukio/update/endpoint',
      messageAction: (message: IMessage) => {
        this.updateUkioSub.next(JSON.parse(message.body));
      },
    },
  ];

  currentIncoming: any; // текущий открытый звонок
  currentIncomingModal: NgbModalRef; // текущий открытый звонок модалка
  showSocketModals = true; // false - блокировка открытия новых модалок
  sbsc: Subscription[] = [];

  constructor(
    public user: UserService,
    private router: Router,
    private api: MedApi,
    private ns: NotificationsService,
    private modal: NgbModal,
    public access: RoleAccessService
  ) {

  }

  initMainSubscriptions() {
    this.sbsc.push(
      this.callIncomingSub.pipe(filter(() => this.showSocketModals)).subscribe(
        (incall: IIncomingCallSocket) => {

          console.log('Incomming call', incall);
          if (this.currentIncoming && incall.sessionId === this.currentIncoming.sessionId) {
            this.currentIncomingModal.dismiss();
            delete this.currentIncoming;
          }


          if (incall.performerId === this.user.mePerformer.performer.id && this.user.mePerformer.callOperatorInfoBean) {
            if (this.modal.hasOpenModals()) this.modal.dismissAll();
            this.currentIncoming = incall;
            this.currentIncomingModal = this.modal.open(IncommingCallComponent, {backdrop: "static"});
            this.currentIncomingModal.componentInstance.callItem = incall;
            if (incall.ukio) {
              this.currentIncomingModal.result.then(
                res => {
                  if (res) {
                    localStorage.setItem('ukio', JSON.stringify(incall));
                    this.router.navigate(['/calls/' + incall.ukio.callId])
                  }
                },
                err => {
                }
              );
            } else {
              this.currentIncomingModal.result.then(
                res => {
                  if (res) {
                    localStorage.setItem('incoming', JSON.stringify(incall));
                    this.router.navigate(['/calls/new-call'])
                  }
                },
                err => {
                }
              );
            }


          }
        }
      ),
      this.callProcessingSub.pipe(filter(() => this.showSocketModals)).subscribe(
        callPr => {
          console.log(callPr);
          if (this.access.checkAccessForRoles([_Roles.DIRECTION_DISPATCHER]) && callPr.subdivisionId === this.user.mePerformer.performer.subdivisionFK.id) {
            this.ns.warn('Новый вызов', 'Требуется назначить бригаду на вызов!');
          } else {
            console.log('This is out of my jurisdiction.', callPr);
          }
        }
      ),
      this.aviationRequestSub.pipe(filter(() => this.showSocketModals)).subscribe(
        ar => {
          if (this.access.checkAccessForRoles([_Roles.TCMK_DISPATCHER])) {
            const inreq = this.modal.open(ModalIncomingAviationComponent);
            inreq.result.then(
              res => {
                if (res) {
                  this.router.navigate(['/aviation/requests']);
                }
              }
            );
          }
        }
      ),
      this.incomingUkioSub.pipe(filter(() => this.showSocketModals)).subscribe(
        (ukio: IukioSocket) => {
          console.log(ukio);
          if (!this.user.mePerformer.callOperatorInfoBean) {
            console.log('net telephona');
          } else if (!ukio.transferCall) {
            const ukioModal = this.modal.open(ModalUkioIncomingComponent);
            ukioModal.componentInstance.ukioItem = ukio;
            ukioModal.result.then(
              res => {
                if (res) {
                  this.router.navigate(['/calls/' + ukio.callId]);
                }
              },
              er => {
              }
            )
          }
        }
      )
    );
  }

  closeMainSubscriptions(){
    this.sbsc.forEach(s => s.unsubscribe());
    this.sbsc = [];
  }

  turnOnModals() {
    this.showSocketModals = true;
    this.ns.success('', 'Уведомления в реальном времени включены');
  }

  turnOffModals() {
    this.showSocketModals = false;
    this.ns.warn('', 'Уведомления в реальном времени отключены на этой странице');
  }

}
