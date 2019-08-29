import {Component, OnInit} from '@angular/core';
import {ColDef, GridApi} from 'ag-grid-community';
import {CallGridDto, MedApi} from '../../../../../swagger/med-api.service';
import {DatePipe} from '@angular/common';
import {CallsService} from '../../services/calls.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalCreateCallComponent} from '../modal-create-call/modal-create-call.component';
import {IGridTableDataSource} from '../../../shared/grid-table/components/grid-table/grid-table.component';

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
    {
      headerName: 'Бригады',
      field: 'brigades',
      sortable: false,
      filter: true,
      width: 180,
      valueGetter: params => {
        if (!params.data.assignedBrigadeList[0].call) {
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
  selectedCall: any;
  callsCards: any[] = [];
  cardLoading: boolean;
  filters: any = {};
  mode: string = 'calls'; // cards
  firstLoaded = false; // для индикатора загрузки карточек
  dateFormatter(params) {
    return params.value ? this.datePipe.transform(params.value, 'dd.MM HH:mm') : '-';
  }

  dataSource: IGridTableDataSource;

  constructor(private calls: CallsService,
              private router: Router,
              private route: ActivatedRoute,
              private modal: NgbModal) {
  }

  ngOnInit() {
    this.updateDataSource();
  }


  updateDataSource() {
    this.dataSource = {
      get: (filter, offset, count) => {
        this.firstLoaded = true;
        return this.calls.getCallsList(offset, count, filter.order, filter.isAsc);
      }
    };
  }

  filterSource(e) {
    console.log(e);
  }

  sortSource(e) {
    console.log(e);
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
    const cc = this.modal.open(ModalCreateCallComponent, {size: 'lg'});
    cc.result.then(
      call => {
        // this.router.navigate([call.call.id], {relativeTo: this.route});
        this.updateDataSource();
        // this.goToCall(call);
      }
    );
  }

  selectCall(e) {
    console.log(e.data);
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

  goToCard(card) {
    console.log(card);
    this.router.navigate([card.data.call + '/card/' + card.data.id], {relativeTo: this.route});
  }

  goToArchive() {
    let command: string;
    if (this.mode === 'calls') {
      command = 'archive/calls';
    } else {
      command = 'archive/f110';
    }
    console.log(command);
    this.router.navigate([command]);
  }

  changeMode() {
    this.mode = this.mode === 'calls' ? 'cards' : 'calls';
  }

  fitCol(e) {
    e.api.sizeColumnsToFit();
  }


}
