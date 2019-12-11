import {Component, Input, OnInit} from '@angular/core';
import {CallItemService} from '../../services/call-item.service';
import {NotificationsService} from 'angular2-notifications';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {zip} from 'rxjs';

@Component({
  selector: 'app-modal-call-brigade-statuses',
  templateUrl: './modal-call-brigade-statuses.component.html',
  styleUrls: ['./modal-call-brigade-statuses.component.scss']
})
export class ModalCallBrigadeStatusesComponent implements OnInit {
  @Input() brigade: any;
  @Input() call: any;

  descriptions = {
    check: [{
      label: '',
      type: 'checkbox',
      key: 'transmitted',
    }],
    dt: [{
      label: '',
      type: 'date',
      key: 'date',
      // styleClass: 'col-8'
    }],
    transfer: [{
      label: '',
      key: 'receiving_type_id',
      type: 'dict',
      dictFilters: {type: 'BRIGADE_RECEIVING'},
      dictFiltersOrder: ['type'],
      bindValue: 'id',
      dict: 'getReferenceTypeListUsingGET',
    }]
  };
  availableStatuses = [
    [1, 8],
    [2, 8],
    [3, 8],
    [6, 8, 9],
    [5, 8],
    [6],
    [],
    [],
    [],
    [4]
  ]; // порядок отпраки сообщений индекс массива = код последнего сообзщения, а содержимое сообщения доступные для отправки
  messagesHistory = []; // история сообщений
  resTypes: any;
  messages: any[] = [];
  selectedMessage: any;
  selectedResType: any;
  loading = true; // флаг загрузки справочников сообщений и типов передачи и исьории сообщений бригады
  endCall = 0; // завершена ли работа с вызовом (если нет то можно отправить сообщение)
  rejectCall = false; // true если отказ от вызова - активирует блок выбора причины
  rejectingStatuses: any[];
  rejectingStatusCode: string;

  constructor(private cs: CallItemService,
              private ns: NotificationsService,
              private modalInstance: NgbActiveModal) {
  }

  ngOnInit() {
    zip(
      this.cs.getMessages(),
      this.cs.getBrigadesMessages(this.brigade.id, this.call.id),
      this.cs.getReceivingTypes(),
      this.cs.getRejectStattuses()
    ).subscribe(value => {
        console.log('zip', value);
        this.updateMessageList(value[0].list, value[1]);
        this.resTypes = value[2].list;
        this.loading = false;
        this.rejectingStatuses = value[3].list;

        console.log('loading', this.loading);
      }
    );
    console.log('loading', this.loading);
    // this.cs.getMessages().subscribe(
    //   mes => {
    //     this.messages = mes.list;
    //     this.messages.sort(
    //       (a, b) => {
    //         if (+a.code > +b.code) return 1;
    //         if (+a.code < +b.code) return -1;
    //         return 0;
    //       }
    //     );
    //     this.messages.shift();
    //     console.log(this.messages);
    //   }
    // );
    // this.cs.getReceivingTypes().subscribe(
    //   rt => {
    //     this.resTypes = rt.list;
    //   }
    // );
    console.log(this.brigade);
  }

  updateMessageList(allMessages, appointMessages) {
    this.messagesHistory = appointMessages;
    console.log('history', this.messagesHistory);
    allMessages.sort(
      (a, b) => {
        if (+a.code > +b.code) return 1;
        if (+a.code < +b.code) return -1;
        return 0;
      }
    );
    console.log(appointMessages, !appointMessages);
    if (!appointMessages.length) {
      this.messages = [allMessages[0], allMessages[7]];
    } else {
      console.log('---', appointMessages[appointMessages.length - 1]);
      if (appointMessages[appointMessages.length - 1].messageTypeFK.code === '6' ||
          appointMessages[appointMessages.length - 1].messageTypeFK.code === '8') {
        this.endCall = appointMessages[appointMessages.length - 1].messageTypeFK.code === '6' ? 1 : 2;
      } else {
        this.availableStatuses[appointMessages[appointMessages.length - 1].messageTypeFK.code].forEach(
          el => this.messages.push(allMessages[el-1])
        );
      }
      console.log('Can send', this.messages);
    }
  }

  // save() {
  //   this.statuses.forEach(
  //     s => {
  //       Object.assign(s, s.form.getRawValue());
  //       console.log(s);
  //       if (s.date) {
  //         s.date.setHours(s.date.getHours() + 3);
  //       }
  //       s.performer_id = this.statuses[0].performer_id;
  //     }
  //   );
  //   const sendingStatuses = this.statuses.filter(el => !el.id && el.transmitted);
  //   this.cs.saveCallBrigadeStatusesHistory(this.brigade.brigade_schedule_id, this.brigade.call_id, sendingStatuses).subscribe(
  //     res => {
  //       this.ns.success('Успешно', 'Статус бригады обновлен');
  //     },
  //     err => {
  //       this.ns.error('Ошибка', 'Не удалось обновить статус');
  //       console.log('err', err);
  //     }
  //   );
  // }

  selectMessage(message) {
    console.log(message);
    this.rejectCall = message.code === '8';
    this.selectedMessage = message;
  }

  selectResType(r) {
    this.selectedResType = r;
  }

  selectRejectType(r) {
    console.log(r);
    this.rejectingStatusCode = r.code;
  }

  sendMessage() {
    this.cs.sendBrigadeMessage(this.brigade.id, this.call.id, this.selectedResType.id, this.selectedMessage.id, this.rejectCall ? this.rejectingStatusCode : undefined ).subscribe(
      res => {
        console.log(res);
        this.ns.success('Сообщение передано');
        this.modalInstance.close(true);
      },
      error1 => {
        console.log('sending mes err', error1);
        this.ns.error('Ошибка отправки сообщения');
        this.back();
      }
    );
  }

  back() {
    this.modalInstance.dismiss();
  }
}
