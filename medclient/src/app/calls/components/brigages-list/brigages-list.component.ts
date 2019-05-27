import {Component, OnInit} from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {BrigadeDutyRequestDto, BrigadeScheduleDto, MedApi, Mode} from '../../../../../swagger/med-api.service';
import {HttpClient} from '@angular/common/http';
import {DatePipe} from '@angular/common';
import {BrigadeDutyService} from '../../services/brigade-duty.service';

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
      valueFormatter: (p) => this.datePipe.transform(p.value, 'dd.MM.yyyy hh:mm'),
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

  constructor( private http: HttpClient, private bs: BrigadeDutyService) {
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
    let dutyResult: any = {
      pharmacy_package_id: this.selectedBrigade.pharmacy_package_id,
      comment: '',
      date: new Date()
    };
    dutyResult = BrigadeDutyRequestDto.fromJS(dutyResult);
    console.log('endDuty', this.selectedBrigade);
    this.bs.endDuty(this.selectedBrigade.id, dutyResult).subscribe(
      res =>{
        console.log(res);
      }
    )
  }

  startDuty(){
    let dutyResult: any = {
      pharmacy_package_id: this.selectedBrigade.pharmacy_package_id,
      comment: '',
      date: new Date()
    };
    dutyResult = BrigadeDutyRequestDto.fromJS(dutyResult);
    console.log('startDuty', this.selectedBrigade, dutyResult);
    this.bs.endDuty(this.selectedBrigade.id, dutyResult).subscribe(
      res =>{
        console.log(res);
      }
    )
  }

}
