import {Component, OnDestroy, OnInit} from '@angular/core';
import {ColDef, GridApi} from 'ag-grid-community';
import {DatePipe} from '@angular/common';
import {CallsService} from '../../services/calls.service';
import {ActivatedRoute, Router} from '@angular/router';
import {IGridTableDataSource} from '../../../shared/grid-table/components/grid-table/grid-table.component';
import {CallBean, CallStatusList} from '../../../../../swagger/med-api.service';
import {Hotkey, HotkeysService} from 'angular2-hotkeys';
import {
  ISimpleDescription,
  SimpleDescriptionService
} from '../../../shared/simple-control/services/simple-description.service';
import {FormControl, FormGroup} from '@angular/forms';
import {debounceTime, tap} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {UserService} from '../../../services/user.service';
import {SocketTopicsService} from "../../../shared/socket-topic/services/socket-topics.service";
import {RoleAccessService} from "../../../services/role-access.service";
import {CallStatusPipe} from "../../../shared/med-pipes/pipes/call-status.pipe";
import {FullnameShorterPipe} from "../../../shared/med-pipes/pipes/fullname-shorter.pipe";
import {MedUtilitesService} from "../../../services/med-utilites.service";

@Component({
  selector: 'app-calls-list',
  templateUrl: './calls-list.component.html',
  styleUrls: ['./calls-list.component.scss']
})
export class CallsListComponent implements OnInit, OnDestroy {
  colDefs: ColDef[] = [
    {
      headerName: '№',
      field: 'number',
      sortable: true,
      filter: false,
      width: 200,
      filterParams: {
        suppressAndOrCondition: true,
        filterOptions: ['contains']
      },
    },
    {
      headerName: 'Статус',
      field: 'status',
      sortable: false,
      filter: false,
      width: 300,
      cellRenderer: (p) => {
        return this.callStatusPipe.transform(p.value);
      },
    },
    {
      headerName: 'Дата',
      field: 'date',
      sortable: false,
      filter: false,
      valueFormatter: (p) => {
        try {
          return this.datePipe.transform(p.value, 'dd.MM.yyyy HH:mm');
        } catch {
          return p.value;
        }
      },
      width: 180
    },
    {
      headerName: 'Район',
      field: 'subdivisionFK.shortName',
      filter: false,
      sortable: false,
      width: 200
    },
    {
      headerName: 'Заявитель',
      field: 'declarantName',
      sortable: false,
      filter: false,
      width: 200,
    },
    {
      headerName: 'Телефон',
      field: 'declarantPhone',
      sortable: false,
      filter: false,
      width: 200,
    },
    {
      headerName: 'Повод к вызову',
      field: 'reasonFK',
      sortable: false,
      filter: false,
      width: 220,
      valueFormatter: params => {
        if (!params.value || !params.value.reason || !params.value.primaryInquirerFK.answer) {
          return 'не указан';
        } else {
          return params.value.primaryInquirerFK.answer + ': ' + params.value.reason;
        }
      }
    },
    {
      headerName: 'Адрес',
      field: 'address',
      sortable: false,
      filter: false,
      width: 220,
    },
    {
      headerName: 'Пациенты',
      field: 'patientList',
      sortable: false,
      filter: false,
      width: 250,
      valueFormatter: params => this.nameShorterPipe.transform(params.value),
    },
    {
      headerName: 'Бригады',
      field: 'assignedBrigadeList',
      sortable: false,
      filter: false,
      width: 180,
      valueFormatter: params => {
        if (!params.value || !params.value[0] || !params.value[0].id) {
          return '';
        }
        let bris = '';
        params.value.forEach(b => bris = bris + b.brigadeFK.name + ', ');
        bris = bris.slice(0, -2);
        return bris;
      },
    },
  ];
  datePipe = new DatePipe('ru');
  callStatusPipe = new CallStatusPipe();
  nameShorterPipe = new FullnameShorterPipe();
  selectedCall: CallBean;
  callsCards: any[] = [];
  cardLoading: boolean;
  subdivisionList = [];
  form = new FormGroup({
    subdivision: new FormControl(this.user.mePerformer.performer.subdivisionFK.id)
  });
  mode: string = 'calls'; // cards
  dateFormatter(params) {
    return params.value ? this.datePipe.transform(params.value, 'dd.MM HH:mm') : '-';
  }

  gridOptions = {
    getRowClass: (params) => {
      if (params.data && params.data.emergencySituation === 2) {
        return 'emergency-row';
      } else if (params.data && params.data.priority === 1) {
        return 'priority-row';
      }
    }
  };

  callStatusList = CallStatusList;
  sbscs: Subscription[] = [];
  filter = {
    orderBy: undefined,
    isAsc: true,
    statuses: [
      CallStatusList.UNDONE,
      CallStatusList.CONFIRM,
      CallStatusList.ACTIVE,
      CallStatusList.UNCONFIRM,
      CallStatusList.TRANSPORTING,
      CallStatusList.EVACUATION_REQUIRED
    ],
    subdivisionId: this.user.mePerformer.performer.subdivisionFK.id,
    IsChildrenIncluded: true
  };
  timeControlValue: { minutes: number, seconds: number } = {minutes: null, seconds: null};
  callCount: number;
  dataSource: IGridTableDataSource = {
    get: (filter, offset, count) => {
      delete this.callCount;
      return this.calls.getCallsList(offset, count, filter).pipe(tap(
        res => {
          this.callCount = res.total
        }
      ));
    }
  };

  callsGridApi: GridApi;

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

  constructor(public calls: CallsService,
              private user: UserService,
              private router: Router,
              private route: ActivatedRoute,
              private sds: SimpleDescriptionService,
              private sTopics: SocketTopicsService,
              public access: RoleAccessService,
              private hotkeysService: HotkeysService,
              private utility: MedUtilitesService) {
    this.hotkeys.forEach(key => this.hotkeysService.add(key));
  }

  ngOnInit() {
    setInterval(this.timeControl.bind(this), 500);
    this.sbscs.push(
      this.utility.getSubdivisionFilters().subscribe(list => {
        this.subdivisionList = list;
      }),
      this.form.valueChanges.pipe(debounceTime(300)).subscribe(
        f => {
          this.filter.subdivisionId = f['subdivision'] || undefined;
          this.updateFilter();
        }
      ),
      this.sTopics.callUpdatedSub.subscribe(
        update => {
          let node = this.callsGridApi.getRenderedNodes().find(node => node.data.id === update.id);
          if (node) {
            update.date = node.data.date; // todo: костыль, убрать после исправлении даты в сокете
            node.updateData(update);
          }
        }
      ),
      this.sTopics.callStatusSub.subscribe(
        update => {
          let node = this.callsGridApi.getRenderedNodes().find(node => node.data.id === update.callId);
          if (node) {
            let updateData = node.data;
            updateData.status = update.callStatus;
            node.updateData(updateData);
          }
        }
      ),
    );
  }

  timeControl() {
    if (this.selectedCall) {
      let dif = new Date().getTime() - new Date(this.selectedCall.date).getTime();
      this.timeControlValue.minutes = Math.floor(dif / (60 * 1000));
      this.timeControlValue.seconds = Math.floor((dif % (60 * 1000)) / 1000);
    }
  }


  filterSource(e) {
  }

  sortSource(e) {
    if (e[0]) {
      console.log(e[0]);
      this.filter.orderBy = e[0].colId;
      this.filter.isAsc = e[0].sort === 'asc';
    } else {
      this.filter.orderBy = this.filter.isAsc = undefined;
    }
  }

  updateFilter() {
    if (this.calls.mode === 'original') {
      this.filter.subdivisionId = this.filter.subdivisionId || this.user.mePerformer.performer.subdivisionFK.id; // Костыль на ограничение видимости
    } else {
      this.filter.subdivisionId = this.filter.subdivisionId || undefined;
    }
    this.filter = Object.assign({}, this.filter);
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
    this.callsGridApi = e.api;
    this.callsGridApi.sizeColumnsToFit();
  }

  ngOnDestroy() {
    this.sbscs.forEach(el => el.unsubscribe());
  }
}
