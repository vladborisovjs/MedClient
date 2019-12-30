import {Component, OnDestroy, OnInit} from '@angular/core';
import {ColDef} from "ag-grid-community";
import {IGridTableDataSource} from "../../../shared/grid-table/components/grid-table/grid-table.component";
import {UserLogsService} from "../services/user-logs.service";
import {DatePipe} from "@angular/common";
import {ACTIONS_RU, RecordType_RU, RecordType} from "../../../shared/logs/log-model";
import {FormGroup} from "@angular/forms";
import {
  ISimpleDescription,
  SimpleDescriptionService
} from "../../../shared/simple-control/services/simple-description.service";
import {UserService} from "../../../services/user.service";
import {Subscription} from "rxjs";
import {debounceTime} from "rxjs/operators";

@Component({
  selector: 'app-user-logs',
  templateUrl: './user-logs.component.html',
  styleUrls: ['./user-logs.component.scss']
})
export class UserLogsComponent implements OnInit, OnDestroy {
  datePipe = new DatePipe('ru');
  form: FormGroup;
  description: ISimpleDescription[] = [
    {
      placeholder: 'Фамилия сотрудника',
      key: 'performerFK',
      type: 'dict',
      dict: 'getPerformerListUsingGET',
      addLabel: 'surname',
      dictSearchField: 'surname',
      dictFiltersOrder: ['type', 'name', 'surname'],
      styleClass: 'col-3'
    },
    {
      key: 'logType',
      type: 'select',
      selectList: [
        {id: 0, name: RecordType_RU[0]},
        {id: 1, name: RecordType_RU[1]},
        {id: 2, name: RecordType_RU[2]},
        {id: 3, name: RecordType_RU[3]},
        {id: 4, name: RecordType_RU[4]},
        {id: 5, name: RecordType_RU[5]},
        {id: 6, name: RecordType_RU[6]},
        {id: 7, name: RecordType_RU[7]},
        {id: 8, name: RecordType_RU[8]},
        {id: 9, name: RecordType_RU[9]},
        {id: 10, name: RecordType_RU[10]},
        {id: 11, name: RecordType_RU[11]},
        {id: 12, name: RecordType_RU[12]},
        {id: 13, name: RecordType_RU[13]},
        {id: 14, name: RecordType_RU[14]},
        {id: 15, name: RecordType_RU[15]},
        {id: 16, name: RecordType_RU[16]},
        {id: 17, name: RecordType_RU[17]},
      ],
      placeholder: 'Объект',
      styleClass: 'col-3'
    },
    {
      key: 'actionType',
      type: 'select',
      selectList: [
        {id: 0, name: ACTIONS_RU[0]},
        {id: 1, name: ACTIONS_RU[1]},
        {id: 2, name: ACTIONS_RU[2]},
        {id: 3, name: ACTIONS_RU[3]},
      ],
      placeholder: 'Действие',
      styleClass: 'col-3'
    },
    {
      placeholder: 'Район',
      key: 'subdivisionFK',
      type: 'dict',
      dict: 'getDistrictListUsingGET',
      bindLabel: 'shortName',
      shortDict: true,
      dictFilters: {rootId: [this.user.mePerformer.performer.subdivisionFK.id]},
      dictFiltersOrder: ['rootId'],
      styleClass: 'col-3'
    },
  ];
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
      valueFormatter: (p) => {
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
      valueFormatter: params => {
        if (!params.value && params.value !== 0) return '';
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
  sbsc: Subscription[] = [];

  source: IGridTableDataSource = {
    get: (filter: any, offset: number, count: number) => {
      return this.us.getUserLogs(offset, count, filter);
    }
  };
  filter = {};

  constructor(private us: UserLogsService,
              private user: UserService,
              private sds: SimpleDescriptionService) {
  }

  ngOnInit() {
    this.form = this.sds.makeForm(this.description);
    this.sbsc.push(this.form.valueChanges.pipe(debounceTime(300)).subscribe(s => this.filter = s));
  }

  ngOnDestroy() {
    this.sbsc.forEach(s => s.unsubscribe());
    this.sbsc = [];
  }

}
