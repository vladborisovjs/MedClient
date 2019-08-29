import {Component, OnDestroy, OnInit} from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {BrigadeContainer, Pair, PerformerBean, TransportBean} from '../../../../../swagger/med-api.service';
import {HttpClient} from '@angular/common/http';
import {DatePipe} from '@angular/common';
import {BrigadeDutyService} from '../../services/brigade-duty.service';
import {NotificationsService} from 'angular2-notifications';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-brigages-list',
  templateUrl: './brigages-list.component.html',
  styleUrls: ['./brigages-list.component.scss']
})
export class BrigagesListComponent implements OnInit, OnDestroy {
  listSource = [];
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
  constructor(private http: HttpClient,
              private bs: BrigadeDutyService,
              private ns: NotificationsService) {
  }

  ngOnInit() {
    this.updateBrigades();
  }

  ngOnDestroy() {
    this.sbscs.forEach(el => el.unsubscribe());
  }

  updateBrigades() {
    this.sbscs.push(
      this.bs.getBrigadesOnDuty(this.mode).subscribe(bri => this.listSource = bri)
    )
  }

  fitCol(e) {
    e.api.sizeColumnsToFit();
  }

  changeMode(mode) {
    this.selectedBrigade = null;
    this.listSourceLog = null;
    this.crew = [];
    this.transport = null;
    this.mode = mode;
    this.updateBrigades();
  }


  selectBri(bri) {
    console.log(bri.data);
    this.selectedBrigade = bri.data;
    this.sbscs.push(
      this.bs.getBriCrew(this.selectedBrigade.first.id).subscribe(
        (crew) => {
          console.log('crew', crew);
          this.crew = crew.performerList;
          this.transport = crew.transportBean;
        }
      ),
    this.bs.getBrigadeDoings(this.selectedBrigade.first.id, this.selectedBrigade.second[0].dateFrom).subscribe(
      (doings) => {
        console.log(doings);
        this.doings = doings.list;
      }
    )
    );
  }

  statusFormatter(status: number) {
    switch (status) {
      case 0:
        return 'Бригада не назначениа';
      case 1:
        return 'Не принят бригадой';
      case 2:
        return 'Принят бригадой';
      case 3:
        return 'В работе';
      case 4:
        return 'Завершен';
      case 5:
        return 'Отменен';
    }
    return status;
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
          console.log(res);
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
          console.log(res);
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



  // setBrigadeStatus(briStatus) {
  //   this.bs.setBrigadeStatus(briStatus).subscribe(
  //     res=>{
  //       console.log(res);
  //       this.ns.success('Успешно', `Бригаде ${this.selectedBrigade.first.name} установлен статус ${briStatus.name}`)
  //       this.updateBrigades();
  //     },
  //     err => {
  //       console.log(err);
  //       this.ns.error('Ошибка', 'Не удалось установить статус');
  //     }
  //   );
  // }

}
