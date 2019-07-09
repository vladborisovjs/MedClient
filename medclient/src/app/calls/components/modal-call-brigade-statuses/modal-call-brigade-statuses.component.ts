import {Component, Input, OnInit} from '@angular/core';
import {IPlateInfo} from '../../../shared/info-plate/components/info-plate/info-plate.component';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {CallItemService} from '../../services/call-item.service';
import {NotificationsService} from 'angular2-notifications';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-call-brigade-statuses',
  templateUrl: './modal-call-brigade-statuses.component.html',
  styleUrls: ['./modal-call-brigade-statuses.component.scss']
})
export class ModalCallBrigadeStatusesComponent implements OnInit {
  @Input() brigade: any;

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
      shortDict: true,
      dictFilters: {type: 'BRIGADE_RECEIVING'},
      dictFiltersOrder: ['type'],
      bindLabel: 'name',
      bindValue: 'id',
      dict: 'readAllUsingGET_34',
    }]
  };

  // BRIGADE_RECEIVING
  statuses = [];

  constructor(private cs: CallItemService,
              private sds: SimpleDescriptionService,
              private ns: NotificationsService,
              private modalInstance: NgbActiveModal) {
  }

  ngOnInit() {
    this.cs.getCallBrigadeStatusesHistory(this.brigade.brigade_schedule_id, this.brigade.call_id).subscribe(
      res => {
        this.statuses = res;
        this.statuses.forEach(
          s => {
            s.form = this.sds.makeForm([...this.descriptions.check, ...this.descriptions.dt, ...this.descriptions.transfer]);
          }
        );
        console.log('statuses: ', this.statuses);
      }
    );
    console.log(this.brigade);
  }

  save() {
    this.statuses.forEach(
      s => {
        Object.assign(s, s.form.getRawValue());
        console.log(s);
        if (s.date) { s.date.setHours(s.date.getHours() + 3);}
        s.performer_id = this.statuses[0].performer_id;
      }
    );
    const sendingStatuses = this.statuses.filter(el => !el.id && el.transmitted);
    this.cs.saveCallBrigadeStatusesHistory(this.brigade.brigade_schedule_id, this.brigade.call_id, sendingStatuses).subscribe(
      res => {
        this.ns.success('Успешно', 'Статус бригады обновлен');
      },
      err => {
        this.ns.error('Ошибка', 'Не удалось обновить статус');
        console.log('err', err);
      }
    );
  }

  back() {
    this.modalInstance.dismiss();
  }
}
