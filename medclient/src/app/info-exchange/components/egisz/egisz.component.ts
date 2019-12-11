import {Component, OnDestroy, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {ColDef} from 'ag-grid-community';
import {InfoExchangeService} from '../../services/info-exchange.service';
import {Subscription} from 'rxjs';
import {IGridTableDataSource} from '../../../shared/grid-table/components/grid-table/grid-table.component';

@Component({
  selector: 'app-egisz',
  templateUrl: './egisz.component.html',
  styleUrls: ['./egisz.component.scss']
})
export class EgiszComponent implements OnInit, OnDestroy {
  datePipe = new DatePipe('ru');
  dateFormatter(params) {
    return params.value ? this.datePipe.transform(params.value, 'dd.MM.yyyy HH:mm') : '-';
  }
  colDef: ColDef[] = [
    {
      headerName: 'Дата',
      field: 'date',
      width: 100,
      valueFormatter: (p) => {
        return this.dateFormatter(p);
      },
    },
    {
      headerName: 'Вызов',
      cellRenderer: params => {
        if (params.data.callId) {
          return `<a href="#/calls/${params.data.callId}" target="_blank">${params.data.callNumber}<i class="fas fa-external-link-alt"></i></a>`
        }
      },
      width: 100,
    },
    {
      headerName: 'Карта Ф-110',
      cellRenderer: params => {
        if (params.data.callId && params.data.cardId) {
          return `<a href="#/calls/${params.data.callId}/card/${params.data.cardId}" target="_blank">${params.data.cardNumber}<i class="fas fa-external-link-alt"></i></a>`
        }
      },
      width: 100,
    },
    {
      headerName: 'Пациент',
      cellRenderer: params => {
        if (params.data.fio) {
          return params.data.fio;
        }
      },
      width: 100
    },
    {
      headerName: 'Отправлен',
        cellRenderer: params => {
          if (params.data.successfulSending && params.data.relatedLogFK.successfulSending) {
            return '<i class="fas fa-check-circle text-success"></i>'
          } else {
            return '<i class="fas fa-times-circle text-danger"></i>'
          }
        },
        width: 100,
    },
    {
      headerName: 'Пациент',
      cellRenderer: params => {
          return `<a href="#/info-exchange/xmlPatient/${params.data.id}" target="_blank">Запрос / Ответ<i class="fas fa-external-link-alt"></i></a>`
      }
    },
    {
      headerName: 'СМП',
      cellRenderer: params => {
          return `<a href="#/info-exchange/xmlCase/${params.data.id}" target="_blank">Запрос / Ответ<i class="fas fa-external-link-alt"></i></a>`
      }
    },
    {
      headerName: 'Отправитель',
      valueGetter: params => params.data.performerFK.surname + ' ' + params.data.performerFK.name + ' ' + params.data.performerFK.patronymic,
      width: 100
    },

  ];
  sbscs: Subscription[] = [];
  dataSource: IGridTableDataSource;
  filters = {};
  constructor(private ie: InfoExchangeService) { }

  ngOnInit() {
    this.updateDataSource();
  }

  updateDataSource() {
    this.dataSource = {
      get: (filter, offset, count) => {
        return this.ie.getLogsEGISZ(offset, count);
      }
    };
  }
  ngOnDestroy() {
    this.sbscs.forEach(el => el.unsubscribe());
  }

}
