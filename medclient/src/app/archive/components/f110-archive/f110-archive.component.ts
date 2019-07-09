import { Component, OnInit } from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {ArchiveService, ICallFilter} from '../../services/archive.service';
import {DatePipe} from '@angular/common';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {FormGroup} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-f110-archive',
  templateUrl: './f110-archive.component.html',
  styleUrls: ['./f110-archive.component.scss']
})
export class F110ArchiveComponent implements OnInit {
  datePipe = new DatePipe('ru');
  colDefs: ColDef[] = [
    {
      headerName: '№',
      field: 'number',
      sortable: true,
      filter: true
    },
    {
      headerName: 'Дата',
      field: 'date',
      sortable: true,
      filter: true,
      valueFormatter: (p) => {
        return this.dateFormatter(p);
      }
    },
    {
      headerName: 'Бригада',
      field: 'brigade_name',
      sortable: true,
      filter: true
    },
    {
      headerName: 'Повод',
      field: 'reason_name',
      sortable: true,
      filter: true
    },
    {
      headerName: 'Адрес происшествия',
      field: 'address',
      sortable: true,
      filter: true
    },
    {
      headerName: 'Район',
      field: 'district_name',
      sortable: true,
      filter: true
    },
    {
      headerName: 'Источник',
      field: 'declarant_name',
      sortable: true,
      filter: true
    },
    {
      headerName: 'Исполнитель',
      field: 'performer_name',
      sortable: true,
      filter: true
    },
    {
      headerName: 'Отработка',
      field: 'card_status_name',
      sortable: true,
      filter: true
    },
    {
      headerName: 'Результат',
      field: 'result_name',
      sortable: true,
      filter: true
    },
  ];
  form: FormGroup;
  loading: boolean;
  descriptions: ISimpleDescription[] = [
    {
      key: 'number',
      label: 'Номер',
      type: 'number',
      styleClass: 'col-3',
      additional: {
        block: 'callInfo'
      }
    },
    {
      key: 'callTypeId',
      label: 'Тип',
      type: 'dict',
      shortDict: true,
      dictFilters: {type: 'CALL'},
      dictFiltersOrder: ['type'],
      bindLabel: 'name',
      bindValue: 'id',
      dict: 'readAllUsingGET_34',
      styleClass: 'col-9',
      additional: {
        block: 'callInfo'
      }
    },
    {
      key: 'dateFrom',
      label: 'Дата с',
      type: 'date',
      styleClass: 'col-6',
      additional: {
        block: 'callInfo'
      }
    },
    {
      key: 'dateTo',
      label: 'по',
      type: 'date',
      styleClass: 'col-6',
      additional: {
        block: 'callInfo'
      }
    },
    {
      key: 'subdivisionId',
      label: 'Подразделение',
      type: 'text', // dict
      styleClass: 'col-6',
      additional: {
        block: 'callInfo'
      }
    },
    {
      key: 'performer',
      label: 'Сотрудник',
      type: 'text',
      styleClass: 'col-6',
      additional: {
        block: 'callInfo'
      }
    },
    {
      key: 'patientName',
      label: 'ФИО',
      type: 'text',
      styleClass: 'col-9',
      additional: {
        block: 'patient'
      }
    },
    {
      key: 'patientSex',
      label: 'Пол',
      type: 'select',
      selectList: [
        {name: 'Муж.', id: 1},
        {name: 'Жен.', id: 2},
      ],
      styleClass: 'col-3',
      additional: {
        block: 'patient'
      }
    },
    {
      key: 'reasonTypeId',
      label: 'Повод',
      type: 'dict',
      shortDict: true,
      dict: 'readBasicReasonsUsingGET',
      bindLabel: 'title',
      bindValue: 'id',
      additional: {
        block: 'patient'
      }
    },
    {
      key: 'districtId',
      label: 'Район',
      type: 'dict',
      shortDict: true,
      dict: 'readAllUsingGET_10',
      bindLabel: 'name',
      bindValue: 'id',
      styleClass: 'col-12',
      additional: {
        block: 'address'
      }
    },
    {
      key: 'aoName',
      label: 'Улица',
      styleClass: 'col-12',
      type: 'text', //dict
      additional: {
        block: 'address'
      }
    },
    {
      key: 'declarantName',
      label: 'ФИО',
      type: 'text',
      styleClass: 'col-7',
      additional: {
        block: 'declarant'
      }
    },
    {
      key: 'declarantTypeId',
      label: 'Тип заявителя',
      type: 'dict',
      shortDict: true,
      dictFilters: {type: 'DECLARANT'},
      dictFiltersOrder: ['type'],
      bindLabel: 'name',
      bindValue: 'id',
      dict: 'readAllUsingGET_34',
      styleClass: 'col-5',
      additional: {
        block: 'declarant'
      }
    },
    {
      key: 'callPlaceTypeId',
      label: 'Место вызова',
      type: 'dict',
      shortDict: true,
      dictFilters: {type: 'CALL_PLACE'},
      dictFiltersOrder: ['type'],
      bindLabel: 'name',
      bindValue: 'id',
      dict: 'readAllUsingGET_34',
      styleClass: 'col-6',
      additional: {
        block: 'declarant'
      }
    },
    {
      key: 'declarantPhone',
      label: 'Телефон',
      type: 'text', //dict
      styleClass: 'col-6',
      additional: {
        block: 'declarant'
      }
    },
  ];
  listSource: any[] = [];
  filters: ICallFilter = {
    subdivisionId: null,
    dateFrom: null,
    dateTo: null,
    number: null,
    declarantName: null,
    declarantPhone: null,
    patientName: null,
    patientSex: null,
    patientAgeYears: null,
    patientAgeMonths: null,
    patientAgeDays: null,
    aoName: null,
    districtId: null,
    performer: null,
    callTypeId: null,
    declarantTypeId: null,
    phone: null,
    callPlaceTypeId: null,
    reasonTypeId: null
  };
  constructor(
    private arch: ArchiveService,
    private sds: SimpleDescriptionService,
    private router: Router) { }

  ngOnInit() {
    this.form = this.sds.makeForm(this.descriptions);
    this.searchCards();
  }

  searchCards() {
    this.loading = true;
    this.filters = this.form.getRawValue();
    Object.keys(this.filters).forEach(
      key => {
        this.filters[key] = this.filters[key] ? this.filters[key] : undefined;
      }
    );
    this.arch.searchCard(this.filters).subscribe(
      card => {
        this.listSource = card;
        this.loading = false;
      },
      err => this.loading = false
    );
  }

  fitCol(e) {
    e.api.sizeColumnsToFit();
  }

  dateFormatter(params) {
    return params.value ? this.datePipe.transform(params.value, 'dd.MM.yyyy HH:mm') : '-';
  }

  getBlockDescriptions(block: string): ISimpleDescription[] {
    return this.descriptions.filter(el => {
      if (el.additional) {
        return el.additional.block === block;
      }
      return false;
    });
  }

  goToCard(card) {
    this.router.navigate(['calls/' + card.data.call_id + '/card/' + card.data.card_id + '/side-one']);
  }
  eraseFilters() {
    this.form.reset({});
  }
}
