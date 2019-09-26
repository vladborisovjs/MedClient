import {Component, Input, OnInit} from '@angular/core';
import {UserService} from '../../../services/user.service';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ScheduleService} from '../../services/schedule.service';
import {NotificationsService} from 'angular2-notifications';
import {DatePipe} from '@angular/common';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-modal-prolongation-delete',
  templateUrl: './modal-prolongation-delete.component.html',
  styleUrls: ['./modal-prolongation-delete.component.scss']
})
export class ModalProlongationDeleteComponent implements OnInit {

  @Input() performers: any[] = [];
  dateItem: any;
  performerIds: any[] = [];
  datePipe: DatePipe = new DatePipe('ru');
  desc: ISimpleDescription[] = [
    // {
    //   label: 'Тип',
    //   key: 'scheduleTypeId',
    //   type: 'dict',
    //   dict: 'getScheduleTypeListUsingGET',
    //   bindValue: 'id',
    //   required: true,
    //   addLabel: 'code'
    //   // styleClass: 'line-form col-12'
    // },
    {
      label: 'С: ',
      key: 'from',
      type: 'date',
      showTime: false,
      required: true,
      styleClass: 'line-form col-12'
    },
    {
      label: 'По: ',
      key: 'to',
      type: 'date',
      showTime: false,
      required: true,
      styleClass: 'line-form col-12'
    },
  ];
  form: FormGroup;

  constructor(private user: UserService,
              private sds: SimpleDescriptionService,
              private modalInstance: NgbActiveModal,
              private schs: ScheduleService,
              private ns: NotificationsService) { }

  ngOnInit() {
    let date = new Date();
    this.dateItem = {
      from: new Date(date.getFullYear(), date.getMonth() + 1, 1),
      to: new Date(date.getFullYear(), date.getMonth() + 2, 1)
    };
    this.form = this.sds.makeForm(this.desc);
    console.log(this.dateItem);
    this.performers.forEach(el => {
      this.performerIds.push(el.first.id);
    })
    console.log(this.performerIds);
  }

  submit() {
    Object.assign(this.dateItem, this.form.getRawValue());
    this.schs.prolongationDelete(this.performerIds, this.datePipe.transform(this.dateItem.from,
      'yyyy-MM-dd'), this.datePipe.transform(this.dateItem.to, 'yyyy-MM-dd'))
      .subscribe(
        res => {
          console.log('res1', res);
          this.modalInstance.close(true);
          this.ns.success('Успешно', 'Расписание пролонгировано')
        },
        err => {
          console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeror', err);
          // this.ns.error(err.message);
        }
      );
  }

  back() {
    this.modalInstance.dismiss();
  }

}
