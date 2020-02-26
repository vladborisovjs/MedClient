import {Component, OnInit} from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {IGridTableDataSource} from '../../../shared/grid-table/components/grid-table/grid-table.component';
import {DrugOperationService} from '../../services/drug-operation.service';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-movements',
  templateUrl: './write-offs.component.html',
  styleUrls: ['./write-offs.component.scss']
})
export class WriteOffsComponent implements OnInit {
  writeOffsSource: IGridTableDataSource = {
    get: (filter, offset, count) => {
      return this.drs.getMovementsList(offset, count);
    }
  };
  datePipe = new DatePipe('ru');
  dateFormatter(params) {
    return params.value ? this.datePipe.transform(params.value, 'dd.MM.yyyy HH:mm') : '-';
  }
  colDef: ColDef[] = [
    {
      headerName: 'Дата',
      field: 'time',
      width: 100,
      valueFormatter: (p) => {
        return this.dateFormatter(p);
      },
    },
    {
      headerName: 'Описание',
      cellRenderer: (params) => {
        if (params.data && params.data.drugFK) {
          return `Лекарственный препарат - ${params.data.drugFK.name}`;
        }
        if (params.data && params.data.wareFK) {
          return `Медицинское изделие - ${params.data.wareFK.name}`;
        }
        if (params.data && params.data.otherFK) {
          return `Прочее средство - ${params.data.otherFK.name}`
        }
      },
      width: 500
    },
    // {
    //   headerName: 'Количество',
    //   field: 'volume',
    //   width: 100
    // },
    {
      headerName: 'Действие',
      cellRenderer: (params) => {
        if (params.data && params.data.isWriteDown) {
          return `Списание <i class="fas fa-arrow-down text-danger"></i>`;
        }  else {
          return `Пополнение <i class="fas fa-arrow-up text-success"></i>`;
        }
      },
      width: 100
    },
    {
      headerName: 'Укладка',
      field: 'bagName',
      width: 100
    }
  ];

  constructor(private drs: DrugOperationService) {
  }

  ngOnInit() {
  }

}
