import { Component, OnInit } from '@angular/core';
import {CallItemService} from '../../services/call-item.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormGroup} from '@angular/forms';
import {SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {SubdivisionDto} from '../../../../../swagger/med-api.service';
import {NotificationsService} from 'angular2-notifications';

@Component({
  selector: 'app-modal-call-transfer-available',
  templateUrl: './modal-call-transfer-available.component.html',
  styleUrls: ['./modal-call-transfer-available.component.scss']
})
export class ModalCallTransferAvailableComponent implements OnInit {

  callId: any;
  listSource: any[] = [];
  transfers: any[] = [];
  form: FormGroup;
  descriptions = {
    check: [{
      type: 'checkbox',
      key: 'short_name',
    }],
  };

  checkboxesArr = [];
  constructor(
    private cs: CallItemService,
    private modalInstance: NgbActiveModal,
    private sds: SimpleDescriptionService,
    private ns: NotificationsService) { }

  ngOnInit() {
    this.cs.getAvailable(this.callId).subscribe(
      res => {
        this.checkboxesArr = res;
        this.checkboxesArr.forEach(
          ch => {
            ch.form = this.sds.makeForm([...this.descriptions.check]);
          }
        );
      }
    );
  }
  transfer() {
    this.checkboxesArr.forEach(
      check => {
        Object.assign(check, check.form.getRawValue());
      }
    );
    // this.cs.getTransfer(this.callId).subscribe(
    //   tran => {
    //     this.transfers = tran;
    //     console.log(this.transfers);
    //   }
    // );
    this.transfers.push({
      call_id: 408326,
      date_accept: null,
      date_create: "2019-06-06T10:08:25.669",
      date_received: "2019-06-06T10:08:25.669",
      id: 411964,
      number: null,
      performer_accept_id: null,
      performer_accept_name: "",
      performer_send_id: 1300,
      performer_send_name: "Ф.Х.Капустин",
      recommended_brigades: [],
      sub_from_id: 120,
      sub_from_name: "Тосненское ОСМП",
      sub_to_id: 108,
      sub_to_name: "Сертоловское ОСМП",
    });
    console.log(this.transfers);
    this.cs.postTransfer(this.callId, this.transfers).subscribe(
      res => {
        this.ns.success('Успешно', 'Данные сохранены');
        this.cancel();
      },
      err => {
        this.ns.error('Ошибка', 'Не удалось сохранить изменения на сервере');
        console.log('Save Call General', err);
      }
    );
  }
  cancel() {
    this.modalInstance.dismiss();
  }

}
