import {Component, OnDestroy, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {ColDef} from 'ag-grid-community';
import {InfoExchangeService} from '../../services/info-exchange.service';
import {Subscription} from 'rxjs';
import {IGridTableDataSource} from '../../../shared/grid-table/components/grid-table/grid-table.component';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {FormGroup} from '@angular/forms';
import {UserService} from '../../../services/user.service';
import {debounceTime} from 'rxjs/operators';

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
        if (params.data && params.data.callId) {
          return `<a href="#/calls/${params.data.callId}" target="_blank">${params.data.callNumber}<i class="fas fa-external-link-alt"></i></a>`
        }
      },
      width: 100,
    },
    {
      headerName: 'Карта Ф-110',
      cellRenderer: params => {
        if (params.data && params.data.callId && params.data.cardId) {
          return `<a href="#/calls/${params.data.callId}/card/${params.data.cardId}" target="_blank">${params.data.cardNumber}<i class="fas fa-external-link-alt"></i></a>`
        }
      },
      width: 100,
    },
    {
      headerName: 'ФИО пациента',
      valueFormatter: params => {
        if (params.data && params.data.fio) {
          return params.data.fio;
        }
      },
      width: 100
    },
    {
      headerName: 'Отправлен',
        cellRenderer: params => {
          if (params.data && params.data.successfulSending && params.data.relatedLogFK && params.data.relatedLogFK.successfulSending) {
            return '<i class="fas fa-check-circle text-success"></i>'
          } else if ((params.data && !params.data.successfulSending) || (params.data && !params.data.relatedLogFK)) {
            return '<i class="fas fa-times-circle text-danger"></i>'
          }
        },
        width: 100,
    },
    {
      headerName: 'Пациент',
      cellRenderer: params => {
        if (params.data) {
          return `<a href="#/info-exchange/xmlPatient/${params.data.relatedLogId}" target="_blank">Запрос / Ответ<i class="fas fa-external-link-alt"></i></a>`
        }
      }
    },
    {
      headerName: 'СМП',
      cellRenderer: params => {
        if (params.data) {
          return `<a href="#/info-exchange/xmlCase/${params.data.id}" target="_blank">Запрос / Ответ<i class="fas fa-external-link-alt"></i></a>`
        }
      }
    },
    {
      headerName: 'Отправитель',
      valueFormatter: params => {
        if (params.data && params.data.performerFK) {
          return params.data.performerFK.surname + ' ' + params.data.performerFK.name + ' ' + params.data.performerFK.patronymic
        }
      },
      width: 100
    },

  ];
  sbsc: Subscription[] = [];
  dataSource: IGridTableDataSource = {
    get: (filter, offset, count) => {
      return this.ie.getLogsEGISZ(offset, count, filter);
    }
  };
  filters = {};
  form: FormGroup;
  description: ISimpleDescription[] = [
    {
      placeholder: 'ФИО пациента',
      type: 'text',
      key: 'fio',
      styleClass: 'col-3',
    },
    {
      placeholder: 'Фамилия сотрудника',
      key: 'performerId',
      type: 'dict',
      dict: 'getPerformerListUsingGET',
      bindValue: 'id',
      addLabel: 'surname',
      dictSearchField: 'surname',
      dictFiltersOrder: ['type', 'name', 'surname'],
      styleClass: 'col-3'
    },
    {
      placeholder: 'Район',
      key: 'subdivisionId',
      type: 'dict',
      dict: 'getDistrictListUsingGET',
      bindLabel: 'shortName',
      bindValue: 'id',
      shortDict: true,
      dictFilters: {rootId: [this.user.mePerformer.performer.subdivisionFK.id]},
      dictFiltersOrder: ['rootId'],
      styleClass: 'col-2'
    },
    {
      placeholder:'С',
      type: 'date',
      key: 'dateFrom',
      showTime: false,
      styleClass: 'col-2'
    },
    {
      placeholder:'По',
      type: 'date',
      key: 'dateTo',
      showTime: false,
      styleClass: 'col-2'
    }
  ];
  constructor(private ie: InfoExchangeService, private sds: SimpleDescriptionService, private user: UserService,) { }

  ngOnInit() {
    this.form = this.sds.makeForm(this.description);
    this.sbsc.push(this.form.valueChanges.pipe(debounceTime(300)).subscribe(s => {
      s.dateFrom && s.dateFrom.setHours(new Date().getTimezoneOffset() / (-60));
      s.dateTo && s.dateTo.setHours(new Date().getTimezoneOffset() / (-60));
      this.filters = s
    }));
  }

  ngOnDestroy() {
    this.sbsc.forEach(el => el.unsubscribe());
  }

}
