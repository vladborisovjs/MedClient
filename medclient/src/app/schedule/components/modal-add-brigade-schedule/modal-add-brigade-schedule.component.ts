import {Component, Input, OnInit} from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalAddPerformerToBrigadeComponent} from '../modal-add-performer-to-brigade/modal-add-performer-to-brigade.component';
import {ModalAddTransportToBrigadeComponent} from '../modal-add-transport-to-brigade/modal-add-transport-to-brigade.component';
import {
  ISimpleDescription,
  SimpleDescriptionService
} from '../../../shared/simple-control/services/simple-description.service';
import {FormGroup} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {ScheduleService} from '../../services/schedule.service';
import {NotificationsService} from 'angular2-notifications';
import {ModalEditPerformerInBrigadeComponent} from '../modal-edit-performer-in-brigade/modal-edit-performer-in-brigade.component';
import {ModalEditTransportInBrigadeComponent} from '../modal-edit-transport-in-brigade/modal-edit-transport-in-brigade.component';
import {max} from "rxjs/operators";
import {ModalConfirmCutTimeComponent} from "../modal-confirm-cut-time/modal-confirm-cut-time.component";

@Component({
  selector: 'app-modal-add-brigade-schedule',
  templateUrl: './modal-add-brigade-schedule.component.html',
  styleUrls: ['./modal-add-brigade-schedule.component.scss']
})
export class ModalAddBrigadeScheduleComponent implements OnInit {
  @Input() brigade: any;
  @Input() date: any;
  @Input() duty = null;
  datePipe = new DatePipe('ru');
  performersColDef: ColDef[] = [
    {
      headerName: 'Сотрудник',
      valueGetter: params => params.data.first ? params.data.first.surname + ' ' + params.data.first.name + ' ' + params.data.first.patronymic :
        params.data.performerFK.surname + ' ' + params.data.performerFK.name + ' ' + params.data.performerFK.patronymic,
    },
    {
      headerName: 'Должность',
      valueGetter: params => params.data.first ? params.data.first.typeFK.name : params.data.performerFK.typeFK.name,
      // field: 'first.typeFK.name',
    },
    {
      headerName: 'Период',
      valueGetter: params => this.datePipe.transform(params.data.second ? params.data.second[0].dateFrom : params.data.dateFrom, 'dd.MM HH:mm') +
        ' - ' + this.datePipe.transform(params.data.second ? params.data.second[0].dateTo : params.data.dateTo, 'dd.MM HH:mm'),
    },
  ];
  transportColDef: ColDef[] = [
    {
      headerName: 'Транспортное средство',
      valueGetter: params => params.data.first ? params.data.first.name : params.data.transportFK.name,
      // field: 'first.name',
    },
    {
      headerName: 'Номер',
      valueGetter: params => params.data.first ? params.data.first.code : params.data.transportFK.code,
      // field: 'first.code',
    },
    {
      headerName: 'Период',
      valueGetter: params => this.datePipe.transform(params.data.second ? params.data.second[0].dateFrom : params.data.dateFrom, 'dd.MM HH:mm') +
        ' - ' + this.datePipe.transform(params.data.second ? params.data.second[0].dateTo : params.data.dateTo, 'dd.MM HH:mm'),
    },
  ];
  performersList = [];
  transportList = [];
  selectedPerformer: any;
  selectedTransport: any;
  mode: string; // new, edit

  timeDesc: ISimpleDescription[] = [
    {
      label: 'c: ',
      key: 'date_from',
      type: 'date',
      styleClass: 'line-form col-12'
    },
    {
      label: 'по: ',
      key: 'date_to',
      type: 'date',
      styleClass: 'line-form col-12'
    },
  ];
  scheduleItem: any;
  form: FormGroup;

  constructor(private modal: NgbModal,
              private sds: SimpleDescriptionService,
              private schs: ScheduleService,
              private ns: NotificationsService,
              private modalInstance: NgbActiveModal) {

  }

  ngOnInit() {

    this.mode = this.duty ? 'edit' : 'new';

    if (this.mode === 'new') {
      let df = new Date(this.date);
      let dt = new Date(this.date);
      df.setHours(df.getHours() + 6);
      dt.setHours(dt.getHours() + 18);
      this.scheduleItem = {
        date_from: df,
        date_to: dt,
      };
    } else {
      this.scheduleItem = {
        date_from: this.duty.dateFrom,
        date_to: this.duty.dateTo,
        duty_start: this.duty.dutyStartDate,
        duty_end: this.duty.dutyEndDate
      };
      this.timeDesc.push(
        {
          label: 'Фактически с: ',
          key: 'duty_start',
          type: 'date',
          styleClass: 'line-form col-12'
        },
        {
          label: 'Фактически по: ',
          key: 'duty_end',
          type: 'date',
          styleClass: 'line-form col-12'
        }
      );
      this.performersList = this.duty.performerScheduleList;
      this.transportList = this.duty.transportScheduleList;
      console.log('INFO ABOUT', this.brigade, this.date, this.duty);
    }

    this.form = this.sds.makeForm(this.timeDesc);
    this.form.reset(this.scheduleItem);
    this.form.valueChanges.subscribe(
      ch => {
        this.scheduleItem.date_from = ch.date_from;
        this.scheduleItem.date_to = ch.date_to;
        this.scheduleItem.duty_start = ch.duty_start;
        this.scheduleItem.duty_end = ch.duty_end;
      }
    );
    // console.log(this)
  }

  addPerformer() {
    const ap = this.modal.open(ModalAddPerformerToBrigadeComponent);
    ap.componentInstance.bFrom = this.scheduleItem.date_from;
    ap.componentInstance.bTo = this.scheduleItem.date_to;
    ap.componentInstance.brigade = this.brigade;
    ap.result.then(
      res => {
        delete res.periods;
        console.log('Добавление сотрудника', res);
        this.performersList.push(res);
        this.performersList = [...this.performersList];
      }
    );
  }

  editPerformer(e) {
    const ep = this.modal.open(ModalEditPerformerInBrigadeComponent);
    ep.componentInstance.performerInfo = e.data;
    console.log('otpravLYAu', e.data)
    ep.result.then(
      per => {
        console.log('POLy4AU', per)
        this.performersList[this.performersList.findIndex(val => val === e.data)] = per;
        this.performersList = [...this.performersList];
      }
    );

  }

  editTransport(e) {
    const ep = this.modal.open(ModalEditTransportInBrigadeComponent);
    ep.componentInstance.transportInfo = e.data;
    console.log('otpravLYAu', e.data)
    ep.result.then(
      per => {
        console.log('POLy4AU', per)
        this.transportList[this.transportList.findIndex(val => val === e.data)] = per;
        this.transportList = [...this.transportList];
      }
    );

  }

  addTransport() {
    const at = this.modal.open(ModalAddTransportToBrigadeComponent);
    at.componentInstance.bFrom = this.scheduleItem.date_from;
    at.componentInstance.bTo = this.scheduleItem.date_to;
    at.componentInstance.brigade = this.brigade;
    at.result.then(
      res => {
        // console.log(res);
        // delete res.periods;
        this.transportList.push(res);
        this.transportList = [...this.transportList];
      }
    );
  }

  fitCol(e) {
    e.api.sizeColumnsToFit();
  }


  buildObjectForSaving() {
    let briItem = {
      transportScheduleList: this.transportList.map(el => {
        return el.second ? el.second[0] : el
      }),
      performerScheduleList: this.performersList.map(el => {
        return el.second ? el.second[0] : el
      }),
      dateFrom: this.scheduleItem.date_from,
      dateTo: this.scheduleItem.date_to,
      dutyStartDate: this.duty ? this.duty.dutyStartDate : null,
      dutyEndDate: this.duty ? this.duty.dutyEndDate : null,
      brigade: this.brigade.brigadeId,
      comment: null,
      id: null
    };
    let timeStatus = this.checkTime(briItem);
    if (timeStatus.status) {
      this.save(briItem)
    } else {
      const confirmCuttingTime = this.modal.open(ModalConfirmCutTimeComponent);
      confirmCuttingTime.componentInstance.dates = timeStatus;
      confirmCuttingTime.result.then(res => {
        briItem.dateFrom = timeStatus.dateFrom;
        briItem.dateTo = timeStatus.dateTo;
        this.save(briItem)
      }, err => {
      })
    }
  }

  save(briItem) {
    console.log('bri item', briItem);
    if (this.mode === 'new') {
      this.schs.createBrigadeSchedule(briItem).subscribe(
        sA => {
          console.log(sA);
          this.ns.success('Успешно', 'Смена успешно сохранена');
          this.modalInstance.close(true);
        },
        error => {
          console.log(error);
        }
      );
    } else if (this.mode === 'edit') {
      console.log(this.duty.id);
      briItem.id = this.duty.id;
      this.schs.editBrigadeSchedule(this.brigade.brigadeId, this.duty.id, briItem).subscribe(
        sA => {
          console.log(sA);
          this.ns.success('Успешно', 'Смена успешно сохранена');
          this.modalInstance.close(true);
        },
        error => {
          console.log(error);
          this.ns.error(error)
        }
      );
    }
  }

  back() {
    this.modalInstance.dismiss();
  }

  selectPerformer(e) {
    this.selectedPerformer = e.data;
  }

  selectTransport(e) {
    this.selectedTransport = e.data;
  }

  deletePerformer() {
    this.performersList.splice(this.performersList.findIndex(val => val === this.selectedPerformer), 1);
    this.performersList = [...this.performersList];

  }

  deleteTransport() {
    this.transportList.splice(this.transportList.findIndex(val => val === this.selectedTransport), 1);
    this.transportList = [...this.transportList];
  }

  checkTime(brigadeSchedule) {
    let maxDateFrom: Date = brigadeSchedule.dateFrom;
    let minDateTo: Date = brigadeSchedule.dateTo;

    brigadeSchedule.transportScheduleList.forEach(el => {
      if (el.dateFrom > maxDateFrom)
        maxDateFrom = el.dateFrom
      if (el.dateTo < minDateTo)
        minDateTo = el.dateTo
    });
    brigadeSchedule.performerScheduleList.forEach(el => {
      if (el.dateFrom > maxDateFrom)
        maxDateFrom = el.dateFrom
      if (el.dateTo < minDateTo)
        minDateTo = el.dateTo
    })
    console.log('MINDATETO AND MAXDATEFROM', minDateTo, maxDateFrom);
    if (minDateTo === brigadeSchedule.dateTo && maxDateFrom === brigadeSchedule.dateFrom) {
      return {
        status: true,
        dateFrom: maxDateFrom,
        dateTo: minDateTo
      };
    } else {
      return {
        status: false,
        dateFrom: maxDateFrom,
        dateTo: minDateTo
      }
    }
  }


}
