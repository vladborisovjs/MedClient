import {Component, OnInit} from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {DatePipe} from '@angular/common';
import {CallsService} from '../../services/calls.service';
import {ActivatedRoute, Router} from '@angular/router';
import {IGridTableDataSource} from '../../../shared/grid-table/components/grid-table/grid-table.component';
import {CallBean} from '../../../../../swagger/med-api.service';
import {Hotkey, HotkeysService} from 'angular2-hotkeys';

@Component({
  selector: 'app-calls-list',
  templateUrl: './calls-list.component.html',
  styleUrls: ['./calls-list.component.scss']
})
export class CallsListComponent implements OnInit {
  colDefs: ColDef[] = [
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
        if (p.value === 427006 || p.value === 427165) {
          return '<div class="text-danger blinking">НЕ ТРОГАТЬ!</div>';
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
      field: 'patientList',
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
              pat = pat + (p.surname ? p.surname : '') + ' ' + (p.name ? p.name : '') + ', ';
            }
          );
          pat = pat.slice(0, -2);
          return pat;
        } else {
          return ' ';
        }

      },
    },
    {
      headerName: 'Бригады',
      field: 'brigades',
      sortable: false,
      filter: true,
      width: 180,
      valueGetter: params => {
        if (!params.data.assignedBrigadeList || !params.data.assignedBrigadeList[0].call) {
          return ' ';
        }
        let bris = '';
        params.data.assignedBrigadeList.forEach(
          b => {
            bris = bris + b.brigadeFK.name + ', ';
          }
        );
        bris = bris.slice(0, -2);
        return bris;
      },
    },
    // {
    //   headerName: 'Сотрудник',
    //   // valueGetter: params => {
    //   //   console.log('/--->', params)
    //   // },
    //   field: 'performerFK.name',
    //   sortable: true,
    //   filter: true,
    //   width: 180,
    // },
  ];
  datePipe = new DatePipe('ru');
  selectedCall: CallBean;
  callsCards: any[] = [];
  cardLoading: boolean;
  filters: any = {};
  mode: string = 'calls'; // cards
  firstLoaded = false; // для индикатора загрузки карточек
  dateFormatter(params) {
    return params.value ? this.datePipe.transform(params.value, 'dd.MM HH:mm') : '-';
  }

  timeControlValue: { minutes: number, seconds: number } = {minutes: null, seconds: null};
  dataSource: IGridTableDataSource;

  hotkeys: Hotkey[] = [
    new Hotkey('shift+n', () => {
      this.createCall();
      return false;
    }),
    new Hotkey('shift+c', () => {
      this.changeMode();
      return false;
    }),
    new Hotkey('shift+a', () => {
      this.goToArchive();
      return false;
    })
  ];

  constructor(private calls: CallsService,
              private router: Router,
              private route: ActivatedRoute,
              private hotkeysService: HotkeysService,) {
    this.hotkeys.forEach(key => this.hotkeysService.add(key));
  }

  ngOnInit() {
    this.updateDataSource();
    setInterval(this.timeControl.bind(this), 500);
    console.log(this.calls.mode);
  }

  timeControl() {
    if (this.selectedCall) {
      let dif = new Date().getTime() - new Date(this.selectedCall.date).getTime();
      this.timeControlValue.minutes = Math.floor(dif / (60 * 1000));
      this.timeControlValue.seconds = Math.floor((dif % (60 * 1000)) / 1000);
    }
  }

  updateDataSource() {
    this.dataSource = {
      get: (filter, offset, count) => {
        this.firstLoaded = true;
        return this.calls.getCallsList(offset, count, filter.order, filter.isAsc, filter.brigadeId);
      }
    };
  }

  filterSource(e) {
  }

  sortSource(e) {
    if (e[0]) {
      this.filters.order = e[0].colId;
      this.filters.isAsc = e[0].sort === 'asc';
    } else {
      this.filters.order = this.filters.isAsc = undefined;
    }
  }

  goToCall(call) {
    this.router.navigate([call.data.id], {relativeTo: this.route});
  }

  createCall() {
    this.router.navigate(['new-call'], {relativeTo: this.route});
  }

  selectCall(e) {
    this.callsCards = [];
    this.selectedCall = e.data;
    this.getCallCards(this.selectedCall.id);
  }

  getCallCards(callId) {
    this.cardLoading = true;
    this.calls.getCallCardsList(callId).subscribe(
      cards => {
        this.callsCards = cards.list;
        this.cardLoading = false;
      }
    );
  }

  goToArchive() {
    let command: string;
    if (this.mode === 'calls') {
      command = 'archive/calls';
    } else {
      command = 'archive/f110';
    }
    this.router.navigate([command]);
  }

  changeMode() {
    this.mode = this.mode === 'calls' ? 'cards' : 'calls';
  }

  fitCol(e) {
    e.api.sizeColumnsToFit();
  }


}
