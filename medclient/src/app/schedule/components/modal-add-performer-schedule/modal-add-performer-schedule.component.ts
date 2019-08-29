import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {
  ISimpleDescription,
  SimpleDescriptionService
} from '../../../shared/simple-control/services/simple-description.service';
import {
  PerformerBean,
  PerformerScheduleDto2,
  PerformerScheduller,
  PerformerShiftBean,
  PeriodDetails,
  ScheduleType, ScheduleTypeBean
} from '../../../../../swagger/med-api.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ScheduleService} from '../../services/schedule.service';
import {NotificationsService} from 'angular2-notifications';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-modal-add-performer-schedule',
  templateUrl: './modal-add-performer-schedule.component.html',
  styleUrls: ['./modal-add-performer-schedule.component.scss']
})
export class ModalAddPerformerScheduleComponent implements OnInit, OnDestroy {
  @Input() performer: any;
  @Input() performerFK: any;
  @Input() date: any;
  @Input() duty = null; // наличие расписания
  mode: string; // new, edit
  constructor(private sds: SimpleDescriptionService,
              private modalInstance: NgbActiveModal,
              private schs: ScheduleService,
              private  ns: NotificationsService) {
  }

  form: FormGroup;
  description: ISimpleDescription[] = [];
  onSchedule: boolean; // по графику/ вне графика
  item: {
    onSchedule: null,
    periodType: null,
    addStart: null,
    addEnd: null,
    schStart: null,
    schEnd: null,
    basic: null
  };
  schItem = PerformerShiftBean.fromJS({});
  sbscs: Subscription[] = [];
  ngOnInit() {
    this.description = [
      // type
      {
        label: 'По графику',
        type: 'checkbox',
        key: 'onSchedule',
        additional: {
          block: 'type'
        }
      },
      // add
      {
        label: 'Начало',
        key: 'dateFrom',
        type: 'date',
        timeOnlyWithDate: this.date,
        styleClass:'line-form col-12',
        additional: {
          block: 'additional'
        }
      },
      {
        label: 'Окончание',
        key: 'dateTo',
        type: 'date',
        timeOnlyWithDate: this.date,
        styleClass:'line-form col-12',
        additional: {
          block: 'additional'
        }
      },
      // schedule
      {
        label: 'Тип',
        key: 'type',
        type: 'dict',
        styleClass: 'col-12',
        // bindValue: 'scheduleTypeFK',
        dict: 'getScheduleTypeListUsingGET',
        additional: {
          block: 'schedule'
        }
      },
      {
        label: 'Начало',
        key: 'dateFrom',
        type: 'date',
        timeOnlyWithDate: this.date,
        styleClass:'line-form col-12',
        additional: {
          block: 'schedule'
        }
      },
      {
        label: 'Окончание',
        key: 'dateTo',
        type: 'date',
        timeOnlyWithDate: this.date,
        styleClass:'line-form col-12',
        additional: {
          block: 'schedule'
        }
      },
    ];
    this.mode = this.duty ? 'edit' : 'new';

    if (this.mode === 'edit') {
      // this.duty = this.duty[0];
      console.log('duty', this.duty);
    }
    this.form = this.sds.makeForm(this.description);
    if (!this.duty) {
      this.form.get('dateTo').setValue(this.date);
      this.form.get('dateFrom').setValue(this.date);
    } else {
      this.form.get('dateTo').setValue(new Date(this.duty.dateTo));
      this.form.get('dateFrom').setValue(new Date(this.duty.dateFrom));
    }
    this.sbscs.push(
      this.form.valueChanges.subscribe(
        ch => {
          this.onSchedule = ch.onSchedule;
        }
      )
    );
  }

  ngOnDestroy() {
    this.sbscs.forEach(el => el.unsubscribe());
  }

  save() {
    let d = this.form.getRawValue();
    console.log(d.type);
    if (this.duty) {
      this.schItem.id = this.duty.id;
    }
    this.schItem.dateFrom = d.dateFrom;
    this.schItem.dateTo = d.dateTo;
    this.schItem.isBasic = true;
    this.schItem.isDeleted = false;
    this.schItem.performerFK = PerformerBean.fromJS(this.performer);
    this.schItem.scheduleTypeFK = ScheduleTypeBean.fromJS(d.type);
    console.log('OOOOOOOOOOOOOOOOO', this.schItem);
    this.sbscs.push(
      this.schs.createPerformerSchedule(this.schItem).subscribe(
        ans => {
          this.ns.success('Успешно', 'График сотрудника обновлен!');
          this.modalInstance.close();
          console.log('ans', ans);
        }
      )
    );
  }

  back() {
    this.modalInstance.dismiss();
  }

  getBlockDescriptions(block = null): ISimpleDescription[] {
    block = block ? block : this.onSchedule ? 'schedule' : 'additional';
    return this.description.filter(el => {
      if (el.additional) {
        return el.additional.block === block;
      }
      return false;
    });
  }

}
