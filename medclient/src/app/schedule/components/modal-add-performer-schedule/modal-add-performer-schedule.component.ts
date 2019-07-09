import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {PerformerScheduleDto2, PerformerScheduller, PeriodDetails, ScheduleType} from '../../../../../swagger/med-api.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ScheduleService} from '../../services/schedule.service';
import {NotificationsService} from 'angular2-notifications';

@Component({
  selector: 'app-modal-add-performer-schedule',
  templateUrl: './modal-add-performer-schedule.component.html',
  styleUrls: ['./modal-add-performer-schedule.component.scss']
})
export class ModalAddPerformerScheduleComponent implements OnInit {
  @Input() performer: any;
  @Input() date: any;
  @Input() duty = null;
  mode: string; // new, edit
  constructor(private sds: SimpleDescriptionService,
              private modalInstance: NgbActiveModal,
              private schs: ScheduleService,
              private  ns: NotificationsService) { }
  form: FormGroup;
  description: ISimpleDescription[] = [
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
      key: 'addStart',
      type: 'date',
      styleClass:'line-form col-12',
      additional: {
        block: 'additional'
      }
    },
    {
      label: 'Окончание',
      key: 'addEnd',
      type: 'date',
      styleClass:'line-form col-12',
      additional: {
        block: 'additional'
      }
    },
    // schedule
    {
      label: 'Тип',
      key:'type',
      type: 'dict',
      shortDict: true,
      dictFilters: {subId: -1000},
      dictFiltersOrder: ['subId'],
      bindLabel: 'name',
      styleClass: 'col-12',
      dict: 'readAllScheduleTypeUsingGET',
      additional: {
        block: 'schedule'
      }
    },
    {
      label: 'Начало',
      key: 'schStart',
      type: 'date',
      showTime: false,
      styleClass:'line-form col-12',
      additional: {
        block: 'schedule'
      }
    },
    {
      label: 'Окончание',
      key: 'schEnd',
      type: 'date',
      showTime: false,
      styleClass:'line-form col-12',
      additional: {
        block: 'schedule'
      }
    },
    {
      label: 'Основной график',
      type: 'checkbox',
      key: 'basic',
      additional: {
        block: 'schedule'
      }
    },
  ];
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
  schItem = PerformerScheduleDto2.fromJS({});

  ngOnInit() {
    this.mode = this.duty ? 'edit' : 'new';

    if (this.mode === 'edit'){
      this.duty = this.duty[0];
      console.log('duty', this.duty);
    }
    this.form = this.sds.makeForm(this.description);
    this.form.valueChanges.subscribe(
      ch => {
        this.onSchedule = ch.onSchedule;
      }
    );
  }

  save(){
    let d = this.form.getRawValue();
    console.log(d);
    const defaultPeriodType = ScheduleType.fromJS({
     days_off: 0,
      days_working: 0,
      id: " ",
      name: " ",
      time_from: "",
      time_to: ""
    });
    this.schItem.performer_id = this.performer.id;
    this.schItem.period_details =  PeriodDetails.fromJS(
      {
        date_from: d.onSchedule ? d.schStart: d.addStart,
        date_to: d.onSchedule ? d.schEnd: d.addEnd,
      }
    );
    this.schItem.period_id = d.type ? d.type.id : null;
    this.schItem.period_type =  d.type ? d.type:  defaultPeriodType;
    this.schItem.scheduller_info = PerformerScheduller.fromJS(
      {basic: d.basic}
    );
    this.schs.createPerformerSchedule(this.performer.id, this.schItem).subscribe(
      ans => {
        console.log('ans', ans);
        this.ns.success('Успешно', 'График сотрудника обновлен!')
        this.modalInstance.close();

      }
    );
    console.log(this.schItem);
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
