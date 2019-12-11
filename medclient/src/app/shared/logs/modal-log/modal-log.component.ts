import {Component, Input, OnInit} from '@angular/core';
import {IGridTableDataSource} from "../../grid-table/components/grid-table/grid-table.component";
import {ColDef} from "ag-grid-community";
import {DatePipe} from "@angular/common";
import {ACTIONS_RU} from "../log-model";

@Component({
  selector: 'app-modal-log',
  templateUrl: './modal-log.component.html',
  styleUrls: ['./modal-log.component.scss']
})
export class ModalLogComponent implements OnInit {
@Input() source: IGridTableDataSource;
  datePipe = new DatePipe('ru');


colDef: ColDef[] = [
  {
    headerName: 'Дата',
    field: 'date',
    valueFormatter: (p) => {
      try {
        return this.datePipe.transform(p.value, 'dd.MM.yyyy HH:mm')
      } catch {
        console.log('Nechai invalid date', p.value);
        return p.value
      }
    },
  },
  {
    headerName: 'Действие',
    field: 'actionType',
    valueFormatter: params => ACTIONS_RU[params.value]
  },
  {
    headerName: 'Описание',
    field: 'description',
  },
  {
    headerName: 'Сотрудник',
    field: 'performerFK',
    valueFormatter: params => params.value.name || '' + ' ' + params.value.surname || ''
  }
];
  constructor() {
  }

  ngOnInit() {
  }

}
