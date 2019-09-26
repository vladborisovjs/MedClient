import {Component, OnInit} from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {ArchiveService} from '../../services/archive.service';
import {DatePipe} from '@angular/common';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {tap} from 'rxjs/operators';

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
      sortable: true,
      filter: true,
      valueGetter: params => params.data.brigadeFK.name
      ,
    },
    {
      headerName: 'Повод',
      valueGetter: params => params.data.callFK.reasonFK.answer,
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
      field: 'declarantName',
      sortable: true,
      filter: true
    },
    {
      headerName: 'Исполнитель',
      valueGetter: params => params.data.performerFK.surname + ' ' + params.data.performerFK.name + ' ' + params.data.performerFK.patronymic,
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
      valueGetter: params => params.data.cardResultBean.resultFK.name,
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
      pattern: '^[0-9]*',
      errorText: 'Поле не может быть отрицательным',
      styleClass: 'col-12',
      additional: {
        block: 'callInfo'
      }
    },
    {
      key: 'callFK',
      label: 'Тип',
      type: 'dict',
      dict: 'getReferenceTypeListCallUsingGET',
      styleClass: 'col-12',
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
      key: 'subdivisionFK',
      label: 'Подразделение',
      type: 'dict',
      dict: 'getSubdivisionTypeListUsingGET',
      styleClass: 'col-6',
      additional: {
        block: 'callInfo'
      }
    },
    {
      key: 'performerFK',
      label: 'Сотрудник',
      type: 'dict',
      dict: 'getPerformerListUsingGET',
      styleClass: 'col-6',
      additional: {
        block: 'callInfo'
      }
    },
    {
      key: 'patientName',
      label: 'ФИО',
      type: 'text',
      errorText: 'Только кириллица',
      pattern: '^[а-яА-ЯёЁ\\s-]*',
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
      key: 'reasonFK',
      label: 'Повод',
      type: 'tree',
      dict: 'getFullNodeUsingGET',
      additional: {
        block: 'patient'
      }
    },
    {
      key: 'districtId',
      label: 'Район',
      type: 'dict',
      dict: 'readAllUsingGET_10',
      bindValue: 'id',
      styleClass: 'col-6',
      additional: {
        block: 'address'
      }
    },
    {
      key: 'aoName',
      label: 'Улица',
      styleClass: 'col-6',
      type: 'text', //dict
      additional: {
        block: 'address'
      }
    },
    {
      key: 'declarantName',
      label: 'ФИО',
      type: 'text',
      errorText: 'Только кириллица',
      pattern: '^[а-яА-ЯёЁ\\s-]*',
      styleClass: 'col-7',
      additional: {
        block: 'declarant'
      }
    },
    {
      key: 'declarantTypeId',
      label: 'Тип заявителя',
      type: 'dict',
      dict: 'getReferenceTypeListDeclarantUsingGET',
      styleClass: 'col-5',
      additional: {
        block: 'declarant'
      }
    },
    {
      key: 'typeFK',
      label: 'Место вызова',
      type: 'dict',
      dict: 'getReferenceTypeListCallPlaceUsingGET',
      styleClass: 'col-6',
      additional: {
        block: 'declarant'
      }
    },
    {
      key: 'declarantPhone',
      label: 'Телефон',
      type: 'number', //dict
      pattern: '^[0-9]*',
      errorText: 'Некорректный номер',
      styleClass: 'col-6',
      additional: {
        block: 'declarant'
      }
    },
  ];
  dataSource = {
    get: (filter, offset, count) => {
      this.loading = true;
      return this.arch.searchCard(offset, count).pipe(tap( () => this.loading = false));
    }
  };
  filters: any = {};
  constructor(
    private arch: ArchiveService,
    private sds: SimpleDescriptionService,
    private router: Router) { }

  ngOnInit() {
    this.form = this.sds.makeForm(this.descriptions);
    this.searchCards();
  }

  selectedTable(e) {
    console.log(e);
  }

  searchCards() {
    this.filters = this.form.getRawValue();

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
    console.log(card);
    this.router.navigate([`calls/${card.data.call}/card/${card.data.id}/side-one`]);
  }
  eraseFilters() {
    this.filters = {};
    this.form.reset({});
  }
}
