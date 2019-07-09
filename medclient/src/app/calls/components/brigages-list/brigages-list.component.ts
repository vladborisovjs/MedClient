import {Component, OnInit} from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {BrigadeDutyRequestDto, BrigadeScheduleDto, MedApi, Mode} from '../../../../../swagger/med-api.service';
import {HttpClient} from '@angular/common/http';
import {DatePipe} from '@angular/common';
import {BrigadeDutyService} from '../../services/brigade-duty.service';
import {NotificationsService} from 'angular2-notifications';

@Component({
  selector: 'app-brigages-list',
  templateUrl: './brigages-list.component.html',
  styleUrls: ['./brigages-list.component.scss']
})
export class BrigagesListComponent implements OnInit {
  listSource = [];
  colDefs: ColDef[] = [
    {
      headerName: 'Бригада',
      field: 'brigade_name',
      sortable: true,
      filter: true,
      width: 150
    },
    {
      headerName: 'Тип',
      field: 'brigade_type_name',
      sortable: true,
      filter: true,
      width: 300
    },
    {
      headerName: 'Статус',
      field: 'brigade_status_name',
      sortable: true,
      filter: true,
      width: 150
    },
  ];
  colDefsLog: ColDef[] = [
    {
      headerName: 'Дата',
      field: 'date',
      sortable: true,
      filter: true,
      valueFormatter: (p) => this.datePipe.transform(p.value, 'dd.MM.yyyy HH:mm'),
      width: 100
    },
    {
      headerName: 'Описание',
      field: 'description',
      sortable: true,
      filter: true,
      width: 400
    },
    {
      headerName: 'Сотрудник',
      field: 'performer_short_name',
      sortable: true,
      filter: true,
      width: 100
    }
  ];
  listSourceLog: any[] = [];
  modes = Mode;
  mode = this.modes.ONLINE;
  selectedBrigade: BrigadeScheduleDto;
  doings: any[];
  datePipe = new DatePipe('ru');

  constructor( private http: HttpClient,
               private bs: BrigadeDutyService,
               private ns: NotificationsService) {
  }

  ngOnInit() {
    this.updateBrigades();
  }

  updateBrigades() {
    this.bs.getBrigadesOnDuty(this.mode).subscribe(bri => this.listSource = bri);
  }

  fitCol(e) {
    e.api.sizeColumnsToFit();
  }

  changeMode(mode) {
    this.selectedBrigade = null;
    this.listSourceLog = null;
    this.mode = mode;
    this.updateBrigades();
  }

  selectBri(bri) {
    console.log(bri.data);
    this.selectedBrigade = bri.data;
    this.bs.getBrigdeProtocol(this.selectedBrigade.id).subscribe(
      (hist) => this.listSourceLog = hist
    );
    this.bs.getBrigadeDoings( this.selectedBrigade.brigade_id, this.selectedBrigade.id).subscribe(
      (doings) => this.doings = doings
    );
  }

  endDuty(){
    let d = new Date();
    // d.setHours(d.getHours() + 3);
    let dutyResult: any = {
      pharmacy_package_id: this.selectedBrigade.pharmacy_package_id,
      comment: '',
      date: d
    };
    dutyResult = BrigadeDutyRequestDto.fromJS(dutyResult);
    console.log('endDuty', this.selectedBrigade);
    this.bs.endDuty(this.selectedBrigade.id, dutyResult).subscribe(
      res =>{
        console.log(res);
        this.updateBrigades();
      },
      error1 => {
        console.log('end duty error');
        this.ns.warn('Ошибка', 'Возможно у бригады есть незавершенные вызовы. \n Проверьте занятость!');
        console.log(error1);
      }
    )
  }

  startDuty(){
    let d = new Date();
    let dutyResult: any = {
      pharmacy_package_id: this.selectedBrigade.pharmacy_package_id,
      comment: '',
      date: d
    };
    dutyResult = BrigadeDutyRequestDto.fromJS(dutyResult);
    console.log('startDuty', this.selectedBrigade, dutyResult);
    this.bs.startDuty(this.selectedBrigade.id, dutyResult).subscribe(
      res =>{
        console.log(res);
        this.updateBrigades();
      }
    )
  }

}
