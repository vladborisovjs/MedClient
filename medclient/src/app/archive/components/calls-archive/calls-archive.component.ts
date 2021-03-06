import {Component, OnDestroy, OnInit} from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {ArchiveService} from '../../services/archive.service';
import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';
import {FormGroup} from '@angular/forms';
import {
  ISimpleDescription,
  SimpleDescriptionService
} from '../../../shared/simple-control/services/simple-description.service';
import {tap} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {CallStatusPipe} from '../../../shared/med-pipes/pipes/call-status.pipe';
import {FullnameShorterPipe} from '../../../shared/med-pipes/pipes/fullname-shorter.pipe';
import {UserService} from '../../../services/user.service';

@Component({
  selector: 'app-calls-archive',
  templateUrl: './calls-archive.component.html',
  styleUrls: ['./calls-archive.component.scss']
})
export class CallsArchiveComponent implements OnInit, OnDestroy {
  colDefs: ColDef[] = [
    {
      headerName: '№',
      field: 'number',
      sortable: false,
      filter: false,
      minWidth: 151, // для полного отобраджения номера
    },
    {
      headerName: 'Дата',
      field: 'date',
      sortable: false,
      filter: false,
      valueFormatter: (p) => this.dateFormatter(p),
      width: 200
    },
    {
      headerName: 'Статус',
      field: 'status',
      sortable: false,
      filter: false,
      width: 180,
      cellRenderer: (p) => {
        return this.callStatusPipe.transform(p.value);
      },
    },
    {
      headerName: 'Заявитель',
      field: 'declarantName',
      sortable: false,
      filter: false,
      width: 200,
    },
    {
      headerName: 'Повод к вызову',
      field: 'reasonFK.reason',
      sortable: false,
      filter: false,
      width: 220,
    },
    {
      headerName: 'Адрес',
      field: 'address',
      sortable: false,
      filter: false,
      width: 220,
    },
    {
      headerName: 'Пациенты',
      field: 'patientList',
      sortable: false,
      filter: false,
      width: 200,
      valueFormatter: params => {
        return this.nameShorterPipe.transform(params.value);
      },
    },
    {
      headerName: 'Бригады',
      field: 'assignedBrigadeList',
      sortable: false,
      filter: false,
      width: 180,
      valueFormatter: params => {
        if (!params.value || !params.value[0] || !params.value[0].id) {
          return '';
        }
        let bris = '';
        params.value.forEach(b => bris = bris + b.brigadeFK.name + ', ');
        bris = bris.slice(0, -2);
        return bris;
      },
    },
    {
      headerName: 'Сотрудник',
      field: 'performerFK',
      valueFormatter: params => this.nameShorterPipe.transform(params.value),
      sortable: false,
      filter: false,
      width: 180,
    },
  ];
  filters: any = {};
  form: FormGroup;
  descriptions: ISimpleDescription[] = [
    {
      key: 'number',
      label: 'Номер',
      type: 'text',
      styleClass: 'col-6',
      additional: {
        block: 'callInfo'
      }
    },
    {
      key: 'callTypeId',
      label: 'Тип',
      type: 'dict',
      dict: 'getReferenceTypeListRingTypeUsingGET',
      bindValue: 'id',
      styleClass: 'col-6',
      additional: {
        block: 'callInfo'
      }
    },
    {
      key: 'dateFrom',
      label: 'Дата с',
      type: 'date',
      showTime: false,
      styleClass: 'col-6',
      additional: {
        block: 'callInfo'
      }
    },
    {
      key: 'dateTo',
      label: 'по',
      type: 'date',
      showTime: false,
      styleClass: 'col-6',
      additional: {
        block: 'callInfo'
      }
    },
    {
      label: 'Приоритет',
      key: 'callPriorityList',
      type: 'select',
      selectList: [
        {name: 'Экстренный', id: [1]},
        {name: 'Неотложный', id: [0]},
      ],
      styleClass: 'col-6',
      additional: {
        block: 'callInfo'
      }
    },
    {
      label: 'Статус',
      key: 'callStatusList',
      type: 'select',
      selectList: [
        {name: 'Незавершенный', id: 0},
        {name: 'Непринятый', id: 1},
        // {name: 'Активный', id: [2]},
        {name: 'В работе', id: 3},
        {name: 'Завершенный', id: 4},
        {name: 'Необоснованный', id: 5},
        {name: 'Транспортировка', id: 6}
      ],
      styleClass: 'col-6',
      additional: {
        block: 'callInfo'
      }
    },
    // {
    //   key: 'subdivisionId',
    //   label: 'Подразделение',
    //   type: 'dict',
    //   dict: 'getSubdivisionTypeListUsingGET',
    //   bindValue: 'id',
    //   styleClass: 'col-6',
    //   additional:{
    //     block: 'callInfo'
    //   }
    // },
    {
      label: 'Бригада',
      key: 'brigadeId',
      type: 'dict',
      dict: 'getBrigadeListUsingGET',
      dictFilters: {subdivisionId: this.user.mePerformer.performer.subdivisionFK.id},
      dictFiltersOrder: ['name', 'code', 'isAvia', 'subdivisionId'],
      bindValue: 'id',
      additional: {
        block: 'callInfo'
      }
    },
    {
      key: 'subdivisionId',
      label: 'Район',
      type: 'dict',
      dict: 'getDistrictListUsingGET',
      bindLabel: 'shortName',
      shortDict: true,
      dictFilters: {rootId: [this.user.mePerformer.performer.subdivisionFK.id]},
      dictFiltersOrder: ['rootId'],
      bindValue: 'id',
      additional: {
        block: 'callInfo'
      }
    },
    {
      label: 'Фамилия',
      key: 'patientSurname',
      type: 'text',
      pattern: '^[а-яА-ЯёЁ\\s-]*',
      errorText: 'Только кириллица',
      styleClass: 'col-4',
      additional: {
        block: 'patient'
      }
    },
    {
      label: 'Имя',
      key: 'patientName',
      type: 'text',
      errorText: 'Только кириллица',
      pattern: '^[а-яА-ЯёЁ\\s-]*',
      styleClass: 'col-4',
      additional: {
        block: 'patient'
      }
    },
    {
      label: 'Отчество',
      key: 'patientPatronymic',
      errorText: 'Только кириллица',
      pattern: '^[а-яА-ЯёЁ\\s-]*',
      type: 'text',
      styleClass: 'col-4',
      additional: {
        block: 'patient'
      }
    },
    {
      label: 'Возраст: лет',
      key: 'patientAgeYears',
      type: 'number',
      pattern: '^[0-9]*',
      errorText: 'Поле не может быть отрицательным',
      styleClass: 'col-4',
      additional: {
        block: 'patient'
      }

    },
    {
      label: 'Месяцев',
      key: 'patientAgeMonths',
      type: 'number',
      pattern: '^[0-9]*',
      errorText: 'Поле не может быть отрицательным',
      styleClass: 'col-4',
      additional: {
        block: 'patient'
      }
    },
    {
      label: 'Дней',
      key: 'patientAgeDays',
      type: 'number',
      pattern: '^[0-9]*',
      errorText: 'Поле не может быть отрицательным',
      styleClass: 'col-4',
      additional: {
        block: 'patient'
      }
    },
    // {
    //   key: 'patientSex',
    //   label: 'Пол',
    //   type: 'select',
    //   selectList: [
    //     {name: 'Муж.', id: 1},
    //     {name: 'Жен.', id: 2},
    //   ],
    //   styleClass: 'col-3',
    //   additional:{
    //     block: 'patient'
    //   }
    // },
    // {
    //   key: 'reason',
    //   label: 'Повод',
    //   type: 'dict',
    //   shortDict: true,
    //   dictFilters: {rootId: 0},
    //   dictFiltersOrder: ['rootId'],
    //   dict: 'getBranchNodeUsingGET',
    //   additional:{
    //     block: 'patient'
    //   }
    // },
    {
      key: 'districtId',
      label: 'Район',
      type: 'text', // dict
      styleClass: 'col-6',
      additional: {
        block: 'address'
      }
    },
    {
      key: 'aoName',
      label: 'Улица',
      styleClass: 'col-6',
      type: 'text', // dict
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
      styleClass: 'col-4',
      additional: {
        block: 'declarant'
      }
    },
    {
      key: 'declarantPhone',
      label: 'Телефон',
      type: 'mask',
      styleClass: 'col-4',
      additional: {
        block: 'declarant'
      }
    },
    {
      key: 'declarantTypeId',
      label: 'Тип заявителя',
      type: 'dict',
      dict: 'getReferenceTypeListDeclarantUsingGET',
      bindValue: 'id',
      styleClass: 'col-4',
      additional: {
        block: 'declarant'
      }
    },
  ];
  loading: boolean;
  datePipe = new DatePipe('ru');
  callStatusPipe = new CallStatusPipe();
  nameShorterPipe = new FullnameShorterPipe();
  sbscs: Subscription[] = [];
  dataSource = {
    get: (filter, offset, count) => {
      this.loading = true;
      return this.arch.searchCall(filter, offset, count).pipe(tap(() => this.loading = false));
    }
  };

  dateFormatter(params) {
    return params.value ? this.datePipe.transform(params.value, 'dd.MM.yyyy HH:mm') : '-';
  }

  constructor(private arch: ArchiveService,
              private router: Router,
              private user: UserService,
              private sds: SimpleDescriptionService) {
  }

  ngOnInit() {
    this.form = this.sds.makeForm(this.descriptions);
    this.form.reset({callStatusList: 4}); // завершенный вызово
    this.searchCalls();
  }

  ngOnDestroy() {
    this.sbscs.forEach(el => el.unsubscribe());
  }

  fitCol(e) {
    e.api.sizeColumnsToFit();
  }

  goToCall(call) {
    console.log(call);
    this.router.navigate([`calls/${call.data.id}`]);
  }

  searchCalls() {
    this.filters = this.form.getRawValue();
    if (this.filters.dateTo) { // дато "по" делается включительной
      this.filters.dateTo.setHours(this.filters.dateTo.getHours() + 24);
      this.filters.dateTo.setSeconds(this.filters.dateTo.getSeconds() - 1);
    }
    this.filters.callStatusList = this.filters.callStatusList ? [this.filters.callStatusList] : undefined;
  }

  getBlockDescriptions(block: string): ISimpleDescription[] {
    return this.descriptions.filter(el => {
      if (el.additional) {
        return el.additional.block === block;
      }
      return false;
    });
  }

  eraseFilters() {
    this.filters = {};
    this.form.reset({});
  }

}
