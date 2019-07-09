import {Component, Input, OnInit} from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalAddPerformerToBrigadeComponent} from '../modal-add-performer-to-brigade/modal-add-performer-to-brigade.component';
import {ModalAddTransportToBrigadeComponent} from '../modal-add-transport-to-brigade/modal-add-transport-to-brigade.component';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {FormGroup} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {ScheduleService} from '../../services/schedule.service';
import {NotificationsService} from 'angular2-notifications';
import {ModalEditPerformerInBrigadeComponent} from '../modal-edit-performer-in-brigade/modal-edit-performer-in-brigade.component';
import {ModalEditTransportInBrigadeComponent} from '../modal-edit-transport-in-brigade/modal-edit-transport-in-brigade.component';

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
      valueGetter: params => params.data.second_name + ' ' + params.data.first_name + ' ' + params.data.patronymic,
    },
    {
      headerName: 'Должность',
      field: 'type_name',
    },
    {
      headerName: 'Период',
      valueGetter: params => this.datePipe.transform(params.data.period_details.date_from, 'dd.MM HH:mm') +
        ' - ' + this.datePipe.transform(params.data.period_details.date_to, 'dd.MM HH:mm'),
    },
  ];
  transportColDef: ColDef[] = [
    {
      headerName: 'Транспортное средство',
      field: 'brand',
    },
    {
      headerName: 'Номер',
      field: 'statemark',
    },
    {
      headerName: 'Период',
      valueGetter: params => this.datePipe.transform(params.data.period_details.date_from, 'dd.MM HH:mm') +
        ' - ' + this.datePipe.transform(params.data.period_details.date_to, 'dd.MM HH:mm'),
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

    if (this.mode === 'new'){
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
        date_from: this.duty.period_details.date_from,
        date_to: this.duty.period_details.date_to,
        duty_start: this.duty.period_details.duty_start,
        duty_end: this.duty.period_details.duty_end
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
      this.performersList = this.duty.performers;
      this.transportList = this.duty.transport_list;
      console.log(this);
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
    console.log(this)
  }

  addPerformer(){
    const ap = this.modal.open(ModalAddPerformerToBrigadeComponent);
    ap.componentInstance.bFrom = this.scheduleItem.date_from;
    ap.componentInstance.bTo = this.scheduleItem.date_to;
    ap.result.then(
      res => {
        delete res.periods;
        console.log('Добавление сотрудника', res);
        this.performersList.push(res);
        this.performersList = [...this.performersList];
      }
    );
  }

  editPerformer(e){
    const ep = this.modal.open(ModalEditPerformerInBrigadeComponent);
    ep.componentInstance.performerInfo = e.data;
    ep.result.then(
      per => {
        this.performersList[this.performersList.findIndex(val => val === e.data)] = per;
        this.performersList = [...this.performersList];
      }
    );

  }

  editTransport(e){
    const ep = this.modal.open(ModalEditTransportInBrigadeComponent);
    ep.componentInstance.transportInfo = e.data;
    console.log(e.data);
    ep.result.then(
      per => {
        this.transportList[this.transportList.findIndex(val => val === e.data)] = per;
        this.transportList = [...this.transportList];
      }
    );

  }

  addTransport(){
    const at = this.modal.open(ModalAddTransportToBrigadeComponent);
    at.componentInstance.bFrom = this.scheduleItem.date_from;
    at.componentInstance.bTo = this.scheduleItem.date_to;
    at.result.then(
      res => {
        console.log(res);
        delete res.periods;
        this.transportList.push(res);
        this.transportList = [...this.transportList];
      }
    );
  }

  fitCol(e) {
    e.api.sizeColumnsToFit();
  }


  save(){
    let briItem = {
      cars: this.transportList,
      performers: this.performersList,
      period_details: {
        date_from: this.scheduleItem.date_from,
        date_to: this.scheduleItem.date_to,
        duty_start: this.duty ? this.duty.period_details.duty_start : null,
        duty_end: this.duty ? this.duty.period_details.duty_end : null
      }
    };
    if (this.mode === 'new'){
      this.schs.createBrigadeSchedule(this.brigade.brigadeId, briItem).subscribe(
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
      this.schs.editBrigadeSchedule(this.brigade.brigadeId, this.duty.id, briItem).subscribe(
        sA => {
          console.log(sA);
          this.ns.success('Успешно', 'Смена успешно сохранена');
          this.modalInstance.close(true);
        },
        error => {
          console.log(error);
        }
      );
    }

  }

  back(){
    this.modalInstance.dismiss();
  }

  selectPerformer(e){
    this.selectedPerformer = e.data;
  }
  selectTransport(e){
    this.selectedTransport = e.data;
  }

  deletePerformer(){
    this.performersList.splice(this.performersList.findIndex(val => val === this.selectedPerformer), 1);
    this.performersList = [...this.performersList];

  }

  deleteTransport(){
    this.transportList.splice(this.transportList.findIndex(val => val === this.selectedTransport), 1);
    this.transportList = [...this.transportList];
  }



}
