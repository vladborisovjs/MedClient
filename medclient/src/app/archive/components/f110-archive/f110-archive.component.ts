import {Component, OnDestroy, OnInit} from '@angular/core';
import {ColDef, GridApi} from 'ag-grid-community';
import {ArchiveService} from '../../services/archive.service';
import {DatePipe} from '@angular/common';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {tap} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {NotificationsService} from 'angular2-notifications';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalMkb10DiagnosisComponent} from '../../../shared/modal-mkb10-diagnosis/components/modal-mkb10-diagnosis.component';
import {CardStatusPipe} from "../../../shared/med-pipes/pipes/card-status.pipe";

@Component({
  selector: 'app-f110-archive',
  templateUrl: './f110-archive.component.html',
  styleUrls: ['./f110-archive.component.scss']
})
export class F110ArchiveComponent implements OnInit, OnDestroy {
  datePipe = new DatePipe('ru');
  colDefs: ColDef[] = [
    {
      headerName: '№ карты',
      field: 'number',
      sortable: true,
      filter: true
    },
    {
      headerName: 'Статус',
      field: 'cardStatus',
      valueFormatter: params => {
        console.log(params);
        return this.cardStatusPipe.transform(params.value);
      },
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
      headerName: 'Пациент',
      valueGetter: params => {
        if (params.data.patientFK) {
          return (params.data.patientFK.surname || '')  + ' ' +  (params.data.patientFK.name || '') + ' ' + (params.data.patientFK.patronymic || '');
        } else {
          return 'пациент не указан';
        }
      }
    },
    {
      headerName: 'Район',
      field: 'subdivisionFK.name',
      sortable: true,
      filter: true
    },
    {
      headerName: 'Бригада',
      sortable: true,
      filter: true,
      valueGetter: params => params.data.brigadeFK.name
    },
    {
      headerName: 'Повод',
      valueGetter: params => params.data.callFK.reasonFK.reason,
      sortable: true,
      filter: true
    },
    // {
    //   headerName: 'Адрес происшествия',
    //   field: 'address',
    //   sortable: true,
    //   filter: true
    // },

    // {
    //   headerName: 'Источник',
    //   field: 'callFK.declarantName',
    //   sortable: true,
    //   filter: true
    // },
    // {
    //   headerName: 'Исполнитель',
    //   valueGetter: params => params.data.performerFK.surname + ' ' + params.data.performerFK.name + ' ' + params.data.performerFK.patronymic,
    //   sortable: true,
    //   filter: true
    // },

    {
      headerName: 'Результат',
      valueGetter: params => {
        if (!params.data.resultTypeFK) {
          return '';
        }
        return params.data.resultTypeFK.name;
      },
      sortable: true,
      filter: true
    },
  ];
  form: FormGroup;
  loading: boolean;
  sending: boolean = false;
  egisz: any[] = [];
  sbscs: Subscription[] = [];
  descriptions: ISimpleDescription[] = [
    // {
    //   key: 'callNumber',
    //   label: 'Номер вызова',
    //   type: 'text',
    //   styleClass: 'col-6',
    //   additional: {
    //     block: 'callInfo'
    //   }
    // },
    {
      key: 'number',
      label: 'Номер карты',
      type: 'text',
      styleClass: 'col-12',
      additional: {
        block: 'callInfo'
      }
    },

    // {
    //   key: 'callFK',
    //   label: 'Тип',
    //   type: 'dict',
    //   dict: 'getReferenceTypeListCallUsingGET',
    //   styleClass: 'col-12',
    //   additional: {
    //     block: 'callInfo'
    //   }
    // },
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
    // {
    //   key: 'performerFK',
    //   label: 'Сотрудник',
    //   type: 'dict',
    //   dict: 'getPerformerListUsingGET',
    //   styleClass: 'col-6',
    //   additional: {
    //     block: 'callInfo'
    //   }
    // },
    {
      label: 'Бригада',
      key: 'brigadeId',
      type: 'dict',
      dict: 'getBrigadeListUsingGET',
      bindValue: 'id',
      styleClass: 'col-6',
      additional: {
        block: 'callInfo'
      }
    },
    {
      label: 'Статус',
      key: 'cardStatus',
      type: 'select',
      styleClass: 'col-6',
      selectList: [
        {name: 'Не оформлена', id: 0},
        {name: 'На проверке', id: 1},
        {name: 'В архиве', id: 2},
        {name: 'Проверено', id: 3},
      ],
      additional: {
        block: 'callInfo'
      }
    },
    {
      key: 'subdivisionId',
      label: 'Район',
      type: 'dict',
      dict: 'getSubdivisionListUsingGET',
      dictFilters: {type: [448641]},
      dictFiltersOrder: ['type'],
      bindValue: 'id',
      additional:{
        block: 'callInfo'
      }
    },
    {
      label: 'Фамилия',
      key: 'surname',
      type: 'text',
      additional: {
        block: 'patient'
      }
    },
    {
      label: 'Имя',
      key: 'name',
      type: 'text',
      additional: {
        block: 'patient'
      }
    },
    {
      label: 'Отчество',
      key: 'patronymic',
      type: 'text',
      additional: {
        block: 'patient'
      }
    },
    {
      label: 'Дата рождения',
      key: 'birthday',
      type: 'date',
      showTime: false,
      yearNavigator: true,
      additional: {
        block: 'patient'
      }
    },
    {
      label: 'Диагноз',
      key: 'mkbName',
      type: 'text',
      readonly: true,
      styleClass: 'col-9',
      additional: {
        block: 'patient'
      }
    },
    {
      label: '',
      placeholder: 'Выбрать',
      key: '',
      type: 'btn',
      action: this.chooseMainDiagnosis.bind(this),
      btnClass: 'mt-4  btn btn-info',
      styleClass: 'col-2',
      additional: {
        block: 'patient'
      }
    },
    // {
    //   key: 'patientName',
    //   label: 'ФИО',
    //   type: 'text',
    //   errorText: 'Только кириллица',
    //   pattern: '^[а-яА-ЯёЁ\\s-]*',
    //   styleClass: 'col-9',
    //   additional: {
    //     block: 'patient'
    //   }
    // },
    // {
    //   key: 'patientSex',
    //   label: 'Пол',
    //   type: 'select',
    //   selectList: [
    //     {name: 'Муж.', id: 1},
    //     {name: 'Жен.', id: 2},
    //   ],
    //   styleClass: 'col-3',
    //   additional: {
    //     block: 'patient'
    //   }
    // },
    // {
    //   key: 'reasonFK',
    //   label: 'Повод',
    //   type: 'tree',
    //   dict: 'getFullNodeUsingGET',
    //   additional: {
    //     block: 'patient'
    //   }
    // },
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
      type: 'mask',
      styleClass: 'col-6',
      additional: {
        block: 'declarant'
      }
    },
  ];
  dataSource = {
    get: (filter, offset, count) => {
      this.loading = true;
      return this.arch.searchCard(filter, offset, count).pipe(tap( () => this.loading = false));
    }
  };
  filters: any = {};
  cardStatusPipe = new CardStatusPipe();
  grid: GridApi;
  constructor(
    private arch: ArchiveService,
    private sds: SimpleDescriptionService,
    private ns: NotificationsService,
    private modal: NgbModal,
    private router: Router) { }

  ngOnInit() {
    this.form = this.sds.makeForm(this.descriptions);
    this.searchCards();
  }

  ngOnDestroy() {
    this.sbscs.forEach(el => el.unsubscribe());
  }

  selectedTable(e) {
    this.egisz = this.grid.getSelectedNodes()
      .filter(item => {return item.data.cardStatus === 3}) // 3 статус в архиве
      .map(ids => {return ids.data.id});
  }

  searchCards() {
    this.filters = this.form.getRawValue();
    if (this.filters.birthday){
      this.filters.birthday.setHours(new Date().getTimezoneOffset() / (-60));
      this.filters.birthday = this.filters.dateBirth.toISOString().slice(0, 19);
    }
    console.log(this.filters);
  }

  fitCol(e) {
    this.grid = e.api;
    this.grid.sizeColumnsToFit();
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
    console.log(card.data);
    this.router.navigate([`calls/${card.data.call}/card/${card.data.id}/side-one`]);
  }
  eraseFilters() {
    this.filters = {};
    this.form.reset({});
  }

  sendEGISZ() {
    this.sending = true;
    console.log('Посылаем егисз', this.egisz);
      this.sbscs.push(
        this.arch.sendEgisz(this.egisz)
          .pipe(tap(() => this.sending = false))
          .subscribe(
            res => {
              this.grid.refreshInfiniteCache();
              this.ns.success('Отправка завершена',
                `Всего отправлено: ${res.length}.
                  Успешно: ${res.filter(item => item === true).length}
                  Неуспешно: ${res.filter(item => item === false).length}`)
            },
            error1 => {
              this.sending = false;
              this.ns.error('Ошибка', 'Не отправлено')
            }
          )
      );
  }

  chooseMainDiagnosis() {
    const chooseDiagnosis = this.modal.open(ModalMkb10DiagnosisComponent, {size: 'lg'});
    chooseDiagnosis.result.then(
      res => {
        if (res) {
          console.log(res);
          this.form.controls['mkbName'].setValue(res.name);
        }
      }
    );
  }
}
