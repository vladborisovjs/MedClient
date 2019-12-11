import {Component, OnInit} from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {IGridTableDataSource} from '../../../shared/grid-table/components/grid-table/grid-table.component';
import {DrugRequestService} from '../../services/drug-request.service';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-movements',
  templateUrl: './movements.component.html',
  styleUrls: ['./movements.component.scss']
})
export class MovementsComponent implements OnInit {
  movementsSource: IGridTableDataSource = {
    get: (filter, offset, count) => {
      return this.drs.getMovementsList(offset, count, filter);
    }
  };
  datePipe = new DatePipe('ru');
  dateFormatter(params) {
    return params.value ? this.datePipe.transform(params.value, 'dd.MM.yyyy HH:mm') : '-';
  }
  filters = {};
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
      headerName: 'Описание',
      field: 'description',
      width: 500
    },
    {
      headerName: 'Укладка',
      field: 'bagFK',
      width: 100,
      valueFormatter: (row) => {
        return row.value.name + ' - ' + row.value.code;
      }
    },
    {
      headerName: 'Карта',
      field: 'cardId',
      width: 100,
      cellRenderer: (row) => {
        console.log(row);
        if (row.value){
          return `<a href="#/calls/${row.data.cardFK.call}/card/${row.data.cardFK.id}/result"><i class="fas fa-external-link-alt"></i></a>`;
        }
        return '';
      }
    },
    {
      headerName: 'Исполнитель',
      field: 'performerFK',
      width: 200,
      valueFormatter: (row) => {
        return row.value.name + '  ' + row.value.surname;
      }
    },

  ];

  constructor(private drs: DrugRequestService) {
  }

  ngOnInit() {
  }

}
