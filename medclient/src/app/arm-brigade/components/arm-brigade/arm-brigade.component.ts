import {Component, OnDestroy, OnInit} from '@angular/core';
import {ColDef, GridApi} from 'ag-grid-community';
import {DatePipe} from '@angular/common';
import {IGridTableDataSource} from '../../../shared/grid-table/components/grid-table/grid-table.component';
import {CallsService} from '../../../calls/services/calls.service';
import {UserService} from '../../../services/user.service';
import {BrigadeBean, BrigadeScheduleBean, CallStatusList} from '../../../../../swagger/med-api.service';
import {Subscription} from 'rxjs';
import {BrigadeDutyService} from '../../../calls/services/brigade-duty.service';
import {NotificationsService} from 'angular2-notifications';
import {ActivatedRoute, Router} from '@angular/router';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {FormGroup} from '@angular/forms';
import {ArmBrigadeService} from '../../services/arm-brigade.service';
import {SocketTopicsService} from '../../../shared/socket-topic/services/socket-topics.service';

@Component({
  selector: 'app-arm-brigade',
  templateUrl: './arm-brigade.component.html',
  styleUrls: ['./arm-brigade.component.scss']
})
export class ArmBrigadeComponent implements OnInit, OnDestroy {
  colDefsCalls: ColDef[] = [
    {
      headerName: '№',
      field: 'number',
      sortable: true,
      filter: true,
      width: 130,
      filterParams: {
        suppressAndOrCondition: true,
        filterOptions: ['contains']
      },
    },
    {
      headerName: 'Статус',
      field: 'status',
      sortable: true,
      filter: true,
      width: 300,
      cellRenderer: (p) => {
        switch (p.value) {
          case 0:
            return '<i class="fas fa-exclamation-circle blinking text-danger"></i> Бригада не назначена';
          case 1:
            return '<i class="fas fa-exclamation-circle text-warning"></i> Не принят бригадой';
          case 2:
            return '<i class="fas fa-clipboard-check text-primary"></i> Принят бригадой';
          case 3:
            return '<i class="fas fa-cog text-primary fa-spin"></i> В работе';
          case 4:
            return '<i class="fas fa-check-circle text-success"></i> Завершен';
          case 5:
            return '<i class="fas fa-ban text-secondary"></i>  Отменен';
          case 6:
            return '<i class="fas fa-ambulance text-primary"></i>  Транспортировка';
        }
        return p.value;
      },
    },
    {
      headerName: 'Дата',
      field: 'date',
      sortable: true,
      filter: true,
      valueFormatter: (p) => {
        return this.dateFormatter(p);
      },
      width: 180
    },
    {
      headerName: 'Заявитель',
      field: 'declarantName',
      sortable: true,
      filter: true,
      width: 200,
    },
    {
      headerName: 'Телефон',
      field: 'declarantPhone',
      sortable: true,
      filter: true,
      width: 200,
    },
    {
      headerName: 'Повод к вызову',
      field: 'reasonFK.reason',
      filter: true,
      width: 220,
      sortable: false,
    },
    {
      headerName: 'Адрес',
      field: 'address',
      filter: true,
      sortable: false,
      width: 220,
    },
    {
      headerName: 'Пациенты',
      field: 'callPatientList',
      sortable: false,
      filter: true,
      width: 250,
      valueGetter: params => {
        if (params.data.patientList && params.data.patientList.length) {
          let pat = '';
          if (!params.data.patientList[0].call) {
            return ' ';
          }
          params.data.patientList.forEach(
            p => {
              pat = pat + (p.surname ? p.surname : '') + ' ' + (p.name ? p.name[0] : '') + '. ' + (p.patronymic ? p.patronymic[0] : '') + '., ';
            }
          );
          pat = pat.slice(0, -2);
          return pat;
        } else {
          return ' ';
        }

      },
    },
  ];
  colDefsCards: ColDef[] = [
    {
      headerName: '№',
      field: 'number',
      sortable: true,
      filter: true,
      width: 80,
    },
    {
      headerName: 'Повод к вызову',
      field: 'callFK.reasonFK.reason',
      sortable: true,
      filter: true,
      width: 220,
    },
    {
      headerName: 'Заявитель',
      field: 'callFK.declarantName',
      sortable: true,
      filter: true,
      width: 120,
    },
    {
      headerName: 'Исполнитель',
      valueGetter: params => params.data.performerFK.surname + ' ' + params.data.performerFK.name + ' ' + params.data.performerFK.patronymic,
      sortable: true,
      filter: true,
      width: 120,
    },
    {
      headerName: 'Статус',
      valueGetter: params => {
        if (params.data.cardStatus === 1) {
          return 'Проверена'
        } else if( params.data.cardStatus === 2) {
          return 'Готова к отправке в ЕГИСЗ';
        } else if (params.data.cardStatus === 4) {
          return 'Отправлено в ЕГИСЗ'
        } else if (params.data.cardStatus === 0) {
          return 'Создана'
        } else {
          return 'Статус не установлен'
        }
      },
      sortable: true,
      filter: true,
      width: 120,
    },
    {
      headerName: 'Результат',
      field: 'resultTypeFK.name',
      sortable: true,
      filter: true,
      width: 120,
    },

  ];
  isInBrigade: boolean; // признак если сотрудник в бригаде
  currentBrigade: BrigadeBean; // текущая бригада сотрудника
  currentBrigadeSchedule: BrigadeScheduleBean; // текущая смена бригада сотрудника
  statusBrigade: any;
  datePipe = new DatePipe('ru');
  loading: boolean = true;
  descriptions: ISimpleDescription[] = [
    {
      placeholder: 'Укажите причину',
      key: 'brigadeStatusFK',
      type: 'dict',
      dict: 'getBrigadeStatusListUsingGET',
      dictFilters: {name: '', code: '', isAvailable: false},
      dictFiltersOrder: ['name', 'code', 'isAvailable'],
    }
  ];
  form: FormGroup;
  sbscs: Subscription[] = [];

  dateFormatter(params) {
    return params.value ? this.datePipe.transform(params.value, 'dd.MM HH:mm') : '-';
  }

  callStatusList = CallStatusList;
  filter = <any>{
    orderBy: undefined,
    isAsc: true,
    statuses: [CallStatusList.UNDONE, CallStatusList.CONFIRM, CallStatusList.ACTIVE, CallStatusList.UNCONFIRM],
  };

  dataSourceCalls: IGridTableDataSource;
  dataSourceCards: IGridTableDataSource;
  callsGridApi: GridApi;
  cardsGridApi: GridApi;
  constructor(private calls: CallsService,
              private bs: BrigadeDutyService,
              private ns: NotificationsService,
              private sds: SimpleDescriptionService,
              private sTopics: SocketTopicsService,
              private arms: ArmBrigadeService,
              private router: Router,
              private route: ActivatedRoute,
              private user: UserService) {
  }

  ngOnInit() {
    this.form = this.sds.makeForm(this.descriptions);
    this.sbscs.push(
      this.form.valueChanges.subscribe(
        el => {
          this.statusBrigade = el.brigadeStatusFK;
        }
      ),
      this.sTopics.callUpdatedSub.subscribe(
        update => {
          let node = this.callsGridApi.getRenderedNodes().find(node => node.data.id === update.id);
          if (node){
            update.date = node.data.date;
            node.updateData(update);
          }
        }
      ),
      this.sTopics.callStatusSub.subscribe(
        update => {
          let node = this.callsGridApi.getRenderedNodes().find(node => node.data.id === update.callId);
          if (node){
            let updateData = node.data;
            updateData.status = update.callStatus;
            this.ns.warn(`Статус вызова ${updateData.number} изменен`,`${this.setStatusCall(updateData.status)}`);
            node.updateData(updateData);
          }
        }
      ),
    );
    this.user.checkAssignedBrigade().subscribe(
      (res: boolean) => {
        this.loading = false;
        this.isInBrigade = res;
        if (this.isInBrigade){
          this.filter.brigadeId = this.user.mePerformer.brigadeBean.id;
          this.currentBrigade = this.user.mePerformer.brigadeBean;
          this.currentBrigadeSchedule = this.user.mePerformer.brigadeSchedule;
        }

      }
    );
    this.updateDataSource();
  }


  updateDataSource() {
    this.dataSourceCalls = {
      get: (filter, offset, count) => {
        return this.calls.getCallsList(offset, count, filter);
      }
    };
    this.dataSourceCards = {
      get: (filter, offset, count) => {
        return this.calls.getActiveCardsList(offset, count, filter);
      }
    };
  }

  updateFilter() {
    this.filter = Object.assign({}, this.filter);
  }

  notReady() {
    if (this.statusBrigade) {
      console.log(this.statusBrigade);
      this.sbscs.push(
        this.bs.brigadeIsNotReady(this.currentBrigade.id, this.statusBrigade.code).subscribe(
          res => {
            console.log(res);
            this.ns.success('Статус обновлен', `Бригада ${this.currentBrigade.name} не готова. Причина: ${this.statusBrigade.name}`);
          },
          err => {
            console.log(err);
            this.ns.error('Ошибка', 'Не удалось установить статус');
          }
        )
      );
    }
    else {
      this.ns.error('Не указана причина');
    }
  }

  returnOnBase() {
    this.sbscs.push(
      this.bs.brigadeReturningOnBase(this.currentBrigade.id).subscribe(
        res => {
          console.log(res);
          this.ns.success('Статус обновлен', `Бригада ${this.currentBrigade.name} в пути на станцию`);
        },
        err => {
          console.log(err);
          this.ns.error('Ошибка', 'Не удалось установить статус');
        }
      )
    );
  }

  sendAlarm() {
    this.sbscs.push(
      this.bs.brigadeAlarm(this.currentBrigade.id).subscribe(
        res => {
          console.log(res);
          this.ns.success('Статус обновлен', `Подан сигнал тревоги бригады ${this.currentBrigade.name}`);
        },
        err => {
          console.log(err);
          this.ns.error('Ошибка', 'Не удалось установить статус');
        }
      )
    );
  }

  freeOnBase() {
    this.sbscs.push(
      this.bs.brigadeOnBase(this.currentBrigade.id).subscribe(
        res => {
          console.log(res);
          this.ns.success('Статус обновлен', `Бригада ${this.currentBrigade.name} свободна на станции`);
        },
        err => {
          console.log(err);
          this.ns.error('Ошибка', 'Не удалось установить статус');
        }
      )
    );
  }

  goToCall(call) {
    this.router.navigate([`${this.router.url}/calls/${call.data.id}`], {relativeTo: this.route});
  }

  goToCard(card) {
    this.router.navigate([`${this.router.url}/calls/${card.data.call}/card/${card.data.id}`], {relativeTo: this.route});
  }

  fitColCalls(e) {
    this.callsGridApi = e.api;
    this.callsGridApi.sizeColumnsToFit();
  }

  fitColCards(e) {
    this.cardsGridApi = e.api;
    this.cardsGridApi.sizeColumnsToFit();
  }

  setStatusCall(status) {
    switch (status) {
      case 0:
        return 'Бригада не назначена';
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
      case 6:
        return 'Транспортировка';
    }
    return '';
  }

  ngOnDestroy() {
    this.sbscs.forEach(el => el.unsubscribe());
  }
}
