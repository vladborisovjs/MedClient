import { Component, OnInit } from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {DatePipe} from '@angular/common';
import {Subscription} from 'rxjs';
import {IGridTableDataSource} from '../../../shared/grid-table/components/grid-table/grid-table.component';
import {UkioService} from '../../services/ukio.service';

@Component({
  selector: 'app-emergency-call-system',
  templateUrl: './emergency-call-system.component.html',
  styleUrls: ['./emergency-call-system.component.scss']
})
export class EmergencyCallSystemComponent implements OnInit {
  datePipe = new DatePipe('ru');
  dateFormatter(params) {
    return params.value ? this.datePipe.transform(params.value, 'dd.MM.yyyy HH:mm') : '-';
  }
  colDef: ColDef[] = [
    // {
    //   headerName: 'Дата приема вызова',
    //   field: 'callDateTime',
    //   width: 100,
    //   valueFormatter: (p) => {
    //     return this.dateFormatter(p);
    //   },
    // },
    {
      headerName: 'УКИО',
      cellRenderer: params => {
        if (params.data && params.data.cardID) {
          return `<a href="#/info-exchange/ukio-messages/${params.data.cardID}">${params.data.cardID}<i class="fas fa-external-link-alt"></i></a>`
        }
      },
      width: 100
    },
    // {
    //   headerName: 'УКИО XML',
    //   cellRenderer: params => {
    //     return `<a href="#/info-exchange/xmlUkio/${params.data.cardID}" target="_blank">Запрос / Ответ<i class="fas fa-external-link-alt"></i></a>`
    //   },
    //   width: 100
    // },
    {
      headerName: 'Отправитель',
      width: 100,
      cellRenderer: params => {
        if (params.data && params.data.listUkioMessageBeanFK) {
          let relevantSender = params.data.listUkioMessageBeanFK;
          return relevantSender.slice(-1)[0].sender;
        }
      }
    },
    {
      headerName: 'Получатель',
      width: 100,
      cellRenderer: params => {
        if (params.data && params.data.listUkioMessageBeanFK) {
          let relevantReceiver = params.data.listUkioMessageBeanFK;
          if (relevantReceiver.slice(-1)[0].sender === '112') {
            return '103';
          } else {
            return '112'
          }
        }
      }
    },

  ];
  sbscs: Subscription[] = [];
  dataSource: IGridTableDataSource;
  filters = {};
  constructor(private ukio: UkioService) { }

  ngOnInit() {
    this.updateDataSource();
  }

  updateDataSource() {
    this.dataSource = {
      get: (filter, offset, count) => {
        return this.ukio.getUkioList(offset, count);
      }
    };
  }
  ngOnDestroy() {
    this.sbscs.forEach(el => el.unsubscribe());
  }
}
