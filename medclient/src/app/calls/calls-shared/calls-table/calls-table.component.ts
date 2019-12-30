import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ICallsTableFilter} from "../calls-container/calls-container.component";
import {ColDef, GridApi} from "ag-grid-community";
import {CallStatusPipe} from "../../../shared/med-pipes/pipes/call-status.pipe";
import {FullnameShorterPipe} from "../../../shared/med-pipes/pipes/fullname-shorter.pipe";
import {CallBean} from "../../../../../swagger/med-api.service";
import {DatePipe} from "@angular/common";
import {IGridTableDataSource} from "../../../shared/grid-table/components/grid-table/grid-table.component";
import {CallsService} from "../../services/calls.service";
import {SocketTopicsService} from "../../../shared/socket-topic/services/socket-topics.service";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-calls-table',
  templateUrl: './calls-table.component.html',
  styleUrls: ['./calls-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CallsTableComponent implements OnInit, OnDestroy {
  @Input() filters: ICallsTableFilter;

  datePipe = new DatePipe('ru');
  callStatusPipe = new CallStatusPipe();
  nameShorterPipe = new FullnameShorterPipe();

  colDef: ColDef[] = [
    {
      headerName: '№',
      field: 'number',
      sortable: false,
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
  gridOptions = {
    getRowClass: (params) => {
      if (params.data && params.data.emergencySituation === 2 ) {
        return 'emergency-row';
      } else if (params.data &&  params.data.emergencySituation === 1) {
        return 'may-emergency-row';
      } else if (params.data && params.data.priority === 1) {
        return 'priority-row';
      }
    }
  };
  dataSource: IGridTableDataSource = {
    get: (filter, offset, count) => {
      return this.calls.getCallsList(offset, count, filter);
    }
  };
  callsGridApi: GridApi;

  sbsc: Subscription[] = [];

  selectedCall: CallBean;

  constructor(private calls: CallsService,
              private sTopics: SocketTopicsService,
              private cdRef: ChangeDetectorRef,
              private router: Router,
              private route: ActivatedRoute,) {
  }

  ngOnInit() {
    this.sbsc.push(
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


  ngOnDestroy() {
    this.sbsc.forEach(s => s.unsubscribe());
    this.cdRef.detach();
  }


  getGridApi(e){
    this.callsGridApi = e.api;
  }

  goToCall(call) {
    this.router.navigate([call.data.id], {relativeTo: this.route});
  }

  selectCall(e){
    this.selectedCall = e.data;
  }

}
