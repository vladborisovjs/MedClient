import {Component, OnDestroy, OnInit} from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {BrigadeContainer, Pair, PerformerBean, TransportBean} from '../../../../../swagger/med-api.service';
import {HttpClient} from '@angular/common/http';
import {DatePipe} from '@angular/common';
import {BrigadeDutyService} from '../../services/brigade-duty.service';
import {NotificationsService} from 'angular2-notifications';
import {Subscription} from 'rxjs';
import {IGridTableDataSource} from "../../../shared/grid-table/components/grid-table/grid-table.component";
import {SocketTopicsService} from "../../../shared/socket-topic/services/socket-topics.service";
import {RoleAccessService} from "../../../services/role-access.service";
import {CallStatusPipe} from "../../../shared/med-pipes/pipes/call-status.pipe";
import {CallsService} from "../../services/calls.service";

enum ACTIONS_RU { // todo:  перенести в пайп или хз
  'Cоздание',
  'Редактирование',
  'Удаление',
  'Восстановление',
  'Передача вызова',
  'Бригада была назначена',
  'Вызов принят',
  'Не принят'
}
@Component({
  selector: 'app-brigages-list',
  templateUrl: './brigages-list.component.html',
  styleUrls: ['./brigages-list.component.scss']
})


export class BrigagesListComponent implements OnInit, OnDestroy {
  listSource = [];
  callStatusPipe = new CallStatusPipe();
  colDefs: ColDef[] = [
    {
      headerName: 'Бригада',
      field: 'first.name',
      sortable: true,
      filter: true,
      width: 150
    },
    {
      headerName: 'Тип',
      field: 'first.brigadeTypeFK.name',
      sortable: true,
      filter: true,
      width: 300
    },
    {
      headerName: 'Статус',
      field: 'first.brigadeStatusFK.name',
      sortable: true,
      filter: true,
      width: 150
    },
  ];
  colDefsLog: ColDef[] = [
    {
      headerName: 'Дата',
      field: 'date',
      valueFormatter: (p) =>{
        try{
          return this.datePipe.transform(p.value, 'dd.MM.yyyy HH:mm')
        } catch{
          return p.value
        }
      }
        ,
    },
    {
      headerName: 'Действие',
      field: 'actionType',
      valueFormatter: params => ACTIONS_RU[params.value]
    },
    {
      headerName: 'Описание',
      field: 'description',
    },
    {
      headerName: 'Сотрудник',
      field: 'performerFK',
      valueFormatter: params =>params.value ? (params.value.name || '' + ' ' + params.value.surname || ''): ''
    }
  ];

  colDefsCalls: ColDef[] = [
    {
      headerName: '№',
      field: 'number',
    },
    {
      headerName: 'Повод',
      field: 'reasonFK.reason',
    },
    {
      headerName: 'Статус',
      field: 'status',
      sortable: false,
      filter: false,
      width: 300,
      cellRenderer: (p) => {
        return this.callStatusPipe.transform(p.value)
      },
    },
  ];
  listSourceLog: IGridTableDataSource;
  listSourceCalls: IGridTableDataSource;
  modes = {
    'OFFLINE': 'OFFLINE',
    'ONLINE': 'ONLINE',
    'UPCOMING': 'UPCOMING',
  };
  mode = this.modes.ONLINE;
  selectedBrigade: Pair;
  doings: any[];
  crew: PerformerBean[];
  transport: TransportBean;
  datePipe = new DatePipe('ru');
  sbscs: Subscription[] = [];

  gridOptions = {
    getRowClass: (params) => {
      if (new Date(params.data && params.data.second[0].dateTo) < new Date()){
        return 'text-danger';
      }
    }
  };
  constructor(private http: HttpClient,
              private bs: BrigadeDutyService,
              private cs: CallsService,
              private sTopics: SocketTopicsService,
              public access: RoleAccessService,
              private ns: NotificationsService) {
  }

  ngOnInit() {
    this.cs.changeFiltering.subscribe(()=>{
      this.updateBrigades();
    });
    this.updateBrigades();
    this.sbscs.push(
      this.sTopics.brigadeStatusSub.subscribe(
        (bstatus)=>{ // todo: не стоит запрашивать сразу весь список
          this.updateBrigades();
        }
      ),
    );
  }

  ngOnDestroy() {
    this.sbscs.forEach(el => el.unsubscribe());
  }

  updateBrigades() {
    this.sbscs.push(
      // this.bs.getBrigadesOnDuty(this.mode).subscribe(bri => this.listSource = bri)
    )
  }

  fitCol(e) {
    e.api.sizeColumnsToFit();
  }

  changeMode(mode) {
    this.listSourceLog = null;
    this.selectedBrigade = null;
    this.crew = [];
    this.transport = null;
    this.mode = mode;
    this.updateBrigades();
  }


  selectBri(bri) {
    console.log(bri.data);
    this.selectedBrigade = bri.data;
    this.listSourceLog = this.bs.getBrigadeLogs(this.selectedBrigade.first.id, this.selectedBrigade.second[0].dateFrom);
    this.listSourceCalls =this.bs.getBrigadeCalls(this.selectedBrigade.first.id);
    this.sbscs.push(
      this.bs.getBriCrew(this.selectedBrigade.first.id).subscribe(
        (crew) => {
          this.crew = crew.performerList;
          this.transport = crew.transportBean;
        }
      )
    );
  }

  endDuty() {
    console.log('endDuty', this.selectedBrigade);
    this.sbscs.push(
      this.bs.endDuty(this.selectedBrigade.second[0].id).subscribe(
        res => {
          this.ns.success('Успешно', `Бригада ${this.selectedBrigade.first.name} завершила смену.`);
          this.updateBrigades();
        },
        error1 => {
          console.log('end duty error');
          this.ns.warn('Ошибка', 'Возможно у бригады есть незавершенные вызовы. \n Проверьте занятость!');
          console.log(error1);
        }
      )
    );
  }

  startDuty() {
    this.sbscs.push(
      this.bs.startDuty(this.selectedBrigade.second[0].id).subscribe(
        res => {
          this.ns.success('Успешно', `Бригада ${this.selectedBrigade.first.name} выведена на линию.`);
          this.updateBrigades();
        },
        error1 => this.ns.error('Ошибка сервера!')
      )
    );
  }

  sendAlarm() {
    this.sbscs.push(
      this.bs.brigadeAlarm(this.selectedBrigade.first.id).subscribe(
        res=>{
          this.ns.success('Успешно', `Подан сигнал тревоги бригады ${this.selectedBrigade.first.name}`);
          this.updateBrigades();
        },
        err => {
          console.log(err);
          this.ns.error('Ошибка', 'Не удалось установить статус');
        }
      )
    );
  }

  sendOnBase() {
    this.sbscs.push(
      this.bs.brigadeOnBase(this.selectedBrigade.first.id).subscribe(
        res=>{
          console.log(res);
          this.ns.success('Успешно', `Бригаде ${this.selectedBrigade.first.name} установлен статус "Свободна на станции"`);
          this.updateBrigades();
        },
        err => {
          console.log(err);
          this.ns.error('Ошибка', 'Не удалось установить статус');
        }
      )
    );
  }
}
