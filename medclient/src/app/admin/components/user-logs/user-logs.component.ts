import {Component, OnInit} from '@angular/core';
import {ColDef} from "ag-grid-community";
import {IGridTableDataSource} from "../../../shared/grid-table/components/grid-table/grid-table.component";
import {UserLogsService} from "../services/user-logs.service";
import {DatePipe} from "@angular/common";
import {ACTIONS_RU, RecordType_RU, RecordType} from "../../../shared/logs/log-model";

@Component({
  selector: 'app-user-logs',
  templateUrl: './user-logs.component.html',
  styleUrls: ['./user-logs.component.scss']
})
export class UserLogsComponent implements OnInit {
  datePipe = new DatePipe('ru');
  colDef: ColDef[] = [
    {
      headerName: 'Дата',
      field: 'date',
      valueFormatter: (p) => {
        try {
          return this.datePipe.transform(p.value, 'dd.MM.yyyy HH:mm')
        } catch {
          return p.value
        }
      },
      width: 70
      ,
    },
    {
      headerName: 'Cотрудник',
      field: 'performerFK',
      valueFormatter: (p)=> {
        if (!p.value) return;
        return p.value.surname + ' ' + p.value.name;
      },
      width: 70
    },
    {
      headerName: 'Действие',
      field: 'actionType',
      valueFormatter: params => ACTIONS_RU[params.value],
      width: 70
    },
    {
      headerName: 'Объект',
      field: 'logType',
      valueFormatter: params =>{
        if (!params.value) return ' ';
        return RecordType_RU[params.value]
      }
      ,
      width: 70
    },
    {
      headerName: 'Описание',
      field: 'description',
      width: 200
    }
  ];

  source: IGridTableDataSource = {
    get: (filter: any, offset: number, count: number) => {
      return this.us.getUserLogs(offset, count, {});
    }
  };

  constructor(private us: UserLogsService) {
  }

  ngOnInit() {
  }

}
