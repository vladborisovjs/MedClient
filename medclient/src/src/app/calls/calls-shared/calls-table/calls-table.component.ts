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
import {tap} from "rxjs/operators";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ModalOverdueCallComponent} from "../modal-overdue-call/modal-overdue-call.component";

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
      let styles = '';
      if (params.data && params.data.emergencySituation === 2 ) {
        styles =  styles + ' emergency-row';
      } else if (params.data &&  params.data.emergencySituation === 1) {
        styles =  styles + ' may-emergency-row';
      } else if (params.data && params.data.priority === 1) {
        styles =  styles + 'priority-row';
      }
      if (params.data && params.data.date && params.data.status !== 4){
        let today = new Date();
        let callDate = new Date(params.data.date);
        if ((+today - (+callDate)) / 3600000 > 24){
          styles = styles + ' overdue-row';
        }
      }
      return styles;
    }
  };

  dataSource: IGridTableDataSource = {
    get: (filter, offset, count) => {
      return this.calls.getCallsList(offset, count, filter).pipe(tap(
        calls => {
          let today = new Date();
          for (let i=0; i < (calls.size -1); i++){
            let callDate = new Date(calls.list[i].date);
            if (((+today - (+callDate)) / 3600000 > 24) && calls.list[i].status !== 4){
              this.modal.open(ModalOverdueCallComponent);
              break;
            }

          }
        }
      ));
    }
  };
  callsGridApi: GridApi;

  sbsc: Subscription[] = [];

  selectedCall: CallBean;

  constructor(private calls: CallsService,
              private sTopics: SocketTopicsService,
              private cdRef: ChangeDetectorRef,
              private modal: NgbModal,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.sbsc.push(
      this.sTopics.callUpdatedSub.subscribe(
        update => {
          const nodes = this.callsGridApi.getRenderedNodes().find(node => node.data.id === update.id);
          if (nodes) {
            update.date = nodes.data.date; // todo: костыль, убрать после исправлении даты в сокете
            nodes.updateData(update);
          }
        }
      ),
      this.sTopics.callStatusSub.subscribe(
        update => {
          const nodes = this.callsGridApi.getRenderedNodes().find(node => node.data.id === update.callId);
          if (nodes) {
            const updateData = nodes.data;
            updateData.status = update.callStatus;
            nodes.updateData(updateData);
          }
        }
      ),
    );
  }

  ngOnDestroy() {
    this.sbsc.forEach(s => s.unsubscribe());
    this.cdRef.detach();
  }

  getGridApi(e) {
    this.callsGridApi = e.api;
  }

  goToCall(call) {
    this.router.navigate([call.data.id], {relativeTo: this.route});
  }

  selectCall(e) {
    this.selectedCall = e.data;
  }

  fitTable() {
    setTimeout(() => {
      this.callsGridApi.sizeColumnsToFit();
    }, 0);
  }
}
