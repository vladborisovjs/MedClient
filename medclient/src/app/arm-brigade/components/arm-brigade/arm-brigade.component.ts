import {Component, OnDestroy, OnInit} from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {DatePipe} from '@angular/common';
import {IGridTableDataSource} from '../../../shared/grid-table/components/grid-table/grid-table.component';
import {CallsService} from '../../../calls/services/calls.service';
import {UserService} from '../../../services/user.service';
import {PerformerContainer} from '../../../../../swagger/med-api.service';
import {Subscription} from 'rxjs';
import {BrigadeDutyService} from '../../../calls/services/brigade-duty.service';
import {NotificationsService} from 'angular2-notifications';
import {tap} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {FormGroup} from '@angular/forms';
import {ArmBrigadeService} from '../../services/arm-brigade.service';

@Component({
  selector: 'app-arm-brigade',
  templateUrl: './arm-brigade.component.html',
  styleUrls: ['./arm-brigade.component.scss']
})
export class ArmBrigadeComponent implements OnInit, OnDestroy {
  colDefsCalls: ColDef[] = [
    {
      headerName: '№',
      field: 'id',
      sortable: true,
      filter: true,
      width: 130,
      filterParams: {
        suppressAndOrCondition: true,
        filterOptions: ['contains']
      },
      cellRenderer: (p) => {
        if (p.value === 427006 || p.value === 427165){
          return '<div class="text-danger blinking">НЕ ТРОГАТЬ!</div>'
        }
        return p.value;
      }
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
            break;
          case 1:
            return '<i class="fas fa-exclamation-circle text-warning"></i> Не принят бригадой';
            break;
          case 2:
            return '<i class="fas fa-cog text-primary fa-spin"></i> Принят бригадой';
            break;
          case 3:
            return '<i class="fas fa-cog text-primary fa-spin"></i> В работе';
            break;
          case 4:
            return '<i class="fas fa-check-circle text-success"></i> Завершен';
            break;
          case 5:
            return '<i class="fas fa-ban text-secondary"></i>  Отменен';
            break;
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
        if (params.data.callPatientList && params.data.callPatientList.length) {
          let pat = '';
          if (!params.data.callPatientList[0].call) {
            return ' ';
          }
          params.data.callPatientList.forEach(
            p => {
              pat = pat + p.patientFK.surname + ' ' + p.patientFK.name + ', ';
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
      field: 'id',
      sortable: true,
      filter: true,
      width: 80,
    },
    {
      headerName: 'Повод к вызову',
      field: 'callFK.reasonFK.name',
      sortable: true,
      filter: true,
      width: 220,
    },
    {
      headerName: 'Заявитель',
      field: 'callFK',
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
      headerName: 'Отработка',
      field: 'card_status_name',
      sortable: true,
      filter: true,
      width: 120,
    },
    {
      headerName: 'Результат',
      field: 'result_name',
      sortable: true,
      filter: true,
      width: 120,
    },

  ];
  brigadeAssigned: PerformerContainer;
  statusBrigade: any = {};
  datePipe = new DatePipe('ru');
  filters: any = {};
  loading: boolean = false;
  descriptions: ISimpleDescription[] = [
    {
      placeholder: 'Укажите причину ',
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

  dataSourceCalls: IGridTableDataSource;
  dataSourceCards: IGridTableDataSource;
  constructor(private calls: CallsService,
              private bs: BrigadeDutyService,
              private ns: NotificationsService,
              private sds: SimpleDescriptionService,
              private arms: ArmBrigadeService,
              private router: Router,
              private route: ActivatedRoute,
              private user: UserService) { }

  ngOnInit() {
    this.form = this.sds.makeForm(this.descriptions);
    this.form.valueChanges.subscribe(
      el => {
          this.statusBrigade = el.brigadeStatusFK;
      }
    );
    this.getMeWithBrigade();
    this.updateDataSource();
    this.form.reset(this.brigadeAssigned);
  }

  getMeWithBrigade() {
    this.loading = true;
    this.sbscs.push(
      this.user.getMeWithBrigade()
        .pipe(tap(() => this.loading = false))
        .subscribe(
        el => {
          this.brigadeAssigned = el;
          console.log(this.brigadeAssigned);
        }
      )
    );
  }

  updateDataSource() {
    this.dataSourceCalls = {
      get: (filter, offset, count) => {
        return this.calls.getCallsList(offset, count, filter.order, filter.isAsc, this.brigadeAssigned.brigadeBean.id);
      }
    };
    this.dataSourceCards = {
      get: (filter, offset, count) => {
        return this.calls.getActiveCardsList(offset, count, this.brigadeAssigned.brigadeBean.id);
      }
    };
  }

  notReady() {
    this.sbscs.push(
      this.bs.brigadeIsNotReady(this.brigadeAssigned.brigadeBean.id, this.statusBrigade.code).subscribe(
        res => {
          console.log(res);
          this.ns.success('Статус обновлен', `Бригада ${this.brigadeAssigned.brigadeBean.name} не готова. Причана: ${this.statusBrigade.name}`);
        },
        err => {
          console.log(err);
          this.ns.error('Ошибка', 'Не удалось установить статус');
        }
      )
    );
  }

  returnOnBase() {
    this.sbscs.push(
      this.bs.brigadeReturningOnBase(this.brigadeAssigned.brigadeBean.id).subscribe(
        res => {
          console.log(res);
          this.ns.success('Статус обновлен', `Бригада ${this.brigadeAssigned.brigadeBean.name} в пути на станцию`);
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
      this.bs.brigadeAlarm(this.brigadeAssigned.brigadeBean.id).subscribe(
        res=>{
          console.log(res);
          this.ns.success('Статус обновлен', `Подан сигнал тревоги бригады ${this.brigadeAssigned.brigadeBean.name}`);
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
      this.bs.brigadeOnBase(this.brigadeAssigned.brigadeBean.id).subscribe(
        res=>{
          console.log(res);
          this.ns.success('Статус обновлен', `Бригада ${this.brigadeAssigned.brigadeBean.name} свободна на станции`);
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

  fitCol(e) {
    e.api.sizeColumnsToFit();
  }

  ngOnDestroy() {
    this.sbscs.forEach(el => el.unsubscribe());
  }
}
