import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  ISimpleDescription,
  SimpleDescriptionService
} from '../../../shared/simple-control/services/simple-description.service';
import {NotificationsService} from 'angular2-notifications';
import {ActivatedRoute, Router} from '@angular/router';
import {FormGroup} from '@angular/forms';
import {DocumentBean, PatientBean} from '../../../../../swagger/med-api.service';
import {Subscription} from 'rxjs';
import {ArchiveService} from '../../services/archive.service';
import {IDocForm} from '../../../card-f110/components/card-side-one-patient/card-side-one-patient.component';
import {CustomModalService} from '../../../shared/modal/services/custom-modal.service';
import {ColDef} from 'ag-grid-community';
import {IGridTableDataSource} from '../../../shared/grid-table/components/grid-table/grid-table.component';

@Component({
  selector: 'app-patient-info',
  templateUrl: './patient-info.component.html',
  styleUrls: ['./patient-info.component.scss']
})
export class PatientInfoComponent implements OnInit, OnDestroy {
  sbscs: Subscription[] = [];
  patItem: PatientBean;
  formPatient: FormGroup;
  formCard: FormGroup;
  descriptionPatient: ISimpleDescription[] = [
    {
      label: 'Фамилия',
      key: 'surname',
      type: 'text',
      errorText: 'Только кириллица',
      pattern: '^[а-яА-ЯёЁ\\s-]*',
      styleClass: 'col-12',
      additional: {
        block: 'patient-info'
      }
    },
    {
      label: 'Имя',
      key: 'name',
      type: 'text',
      errorText: 'Только кириллица',
      pattern: '^[а-яА-ЯёЁ\\s-]*',
      styleClass: 'col-12',
      additional: {
        block: 'patient-info'
      }
    },
    {
      label: 'Отчество',
      key: 'patronymic',
      type: 'text',
      errorText: 'Только кириллица',
      pattern: '^[а-яА-ЯёЁ\\s-]*',
      styleClass: 'col-12',
      additional: {
        block: 'patient-info'
      }
    },
    // {
    //   label: 'Лет',
    //   key: 'ageYears',
    //   type: 'number',
    //   styleClass: 'col-4',
    //   additional: {
    //     block: 'patient-info'
    //   }
    // },
    // {
    //   label: 'Месяцев',
    //   key: 'ageMonths',
    //   type: 'number',
    //   styleClass: 'col-4',
    //   additional: {
    //     block: 'patient-info'
    //   }
    // },
    // {
    //   label: 'Дней',
    //   key: 'ageDays',
    //   type: 'number',
    //   styleClass: 'col-4',
    //   additional: {
    //     block: 'patient-info'
    //   }
    // },
    {
      label: 'Пол',
      key: 'gender',
      type: 'select',
      selectList: [
        {name: 'не указан', id: null},
        {name: 'мужской', id: true},
        {name: 'женский', id: false},
      ],
      styleClass: 'col-6',
      additional: {
        block: 'patient-info'
      }
    },
    {
      label: 'Дата рождения',
      key: 'birthday',
      type: 'date',
      showTime: false,
      yearNavigator: true,
      styleClass: 'col-6',
      additional: {
        block: 'patient-info'
      }
    },
    // {
    //   label: 'Количество карт',
    //   key: 'cardCount',
    //   type: 'number',
    //   readonly: true,
    //   styleClass: 'col-4',
    //   additional: {
    //     block: 'patient-info'
    //   }
    // },
    {
      label: 'Тип пациента',
      key: 'patientTypeFK',
      type: 'dict',
      dropdownPosition: 'top',
      dict: 'getReferenceTypeListPatientTypeUsingGET',
      additional: {
        block: 'patient-info'
      }
    },

    // {
    //   label: 'Место рождения',
    //   key: 'alien_birthplace',
    //   type: 'text',
    //   styleClass: 'col-8',
    //   additional: {
    //     block: 'general'
    //   }
    // },
    {
      label: 'Тип',
      key: 'typeFK',
      type: 'dict',
      dict: 'getDocumentTypeListUsingGET',
      styleClass: '',
      additional: {
        block: 'documents'
      }
    },
    {
      label: 'Страховая компания',
      key: 'organizationFK',
      type: 'dict',
      dict: 'listOfInsuranceCompanyUsingGET',
      styleClass: '',
      additional: {
        block: 'polis'
      }
    },
    {
      label: 'Серия',
      key: 'series',
      type: 'text',
      // pattern: '^[0-9]*',
      // errorText: 'Поле не может быть отрицательным',
      styleClass: 'col-5',
      additional: {
        block: 'documents'
      }
    },
    {
      label: 'Номер',
      key: 'num',
      type: 'number',
      pattern: '^[0-9]*',
      errorText: 'Поле не может быть отрицательным',
      styleClass: 'col-7',
      additional: {
        block: 'documents'
      }
    },
    {
      label: 'Дата выдачи',
      key: 'date',
      showTime: false,
      yearNavigator: true,
      type: 'date',
      additional: {
        block: 'documents'
      }
    },
    {
      label: 'Кем выдан',
      key: 'organization',
      type: 'text',
      additional: {
        block: 'documents'
      }
    },
    {
      label: 'Примечания',
      key: 'description',
      type: 'textarea',
      additional: {
        block: 'documents'
      }
    },
  ];
  colDefsCards: ColDef[] = [
    {
      headerName: '№',
      field: 'number',
      sortable: true,
      filter: true,
      width: 80,
    },
    {
      headerName: 'Повод к вызову',
      field: 'callFK.reasonFK.reason',
      sortable: true,
      filter: true,
      width: 220,
    },
    {
      headerName: 'Заявитель',
      field: 'callFK.declarantName',
      sortable: true,
      filter: true,
      width: 120,
    },
    {
      headerName: 'Исполнитель',
      valueGetter: params => params.data.performerFK.surname + ' ' +
        params.data.performerFK.name + ' ' +
        params.data.performerFK.patronymic,
      sortable: true,
      filter: true,
      width: 120,
    },
    {
      headerName: 'Статус',
      valueGetter: params => {
        if (params.data.cardStatus === 1) {
          return 'Проверена';
        } else if (params.data.cardStatus === 2) {
          return 'Готова к отправке в ЕГИСЗ';
        } else if (params.data.cardStatus === 4) {
          return 'Отправлено в ЕГИСЗ';
        } else if (params.data.cardStatus === 0) {
          return 'Создана';
        } else {
          return 'Статус не установлен';
        }
      },
      sortable: true,
      filter: true,
      width: 120,
    },
    {
      headerName: 'Результат',
      field: 'resultTypeFK.name',
      sortable: true,
      filter: true,
      width: 120,
    },

  ];
  docForms: IDocForm[] = [];
  filters: any = {};
  dataSourceCards: IGridTableDataSource;

  constructor(private route: ActivatedRoute, private router: Router,
              private arch: ArchiveService,
              private ns: NotificationsService,
              private cmodal: CustomModalService,
              private sds: SimpleDescriptionService) {
  }

  ngOnInit() {
    this.formCard = this.sds.makeForm(this.getBlockDescriptions('patient-additional'));
    this.formPatient = this.sds.makeForm(this.getBlockDescriptions('patient-info'));
    this.sbscs.push(
      this.route.data.subscribe(
        data => {
          if (data.patItem) {
            this.patItem = data.patItem;
            this.filters.patientId = this.patItem.id;
            this.formPatient.reset(this.patItem);
          }
          console.log(data.patItem);
        }
      ),
    );
    this.formPatient.valueChanges.subscribe(ch => Object.assign(this.patItem, ch));
    this.updateDataSource();
    this.resetDocForms();
  }

  updateDataSource() {
    this.dataSourceCards = {
      get: (filter, offset, count) => {
        return this.arch.getPatientCards(offset, count, filter);
      }
    };
  }

  getBlockDescriptions(block: string): ISimpleDescription[] {
    return this.descriptionPatient.filter(el => {
      if (el.additional) {
        return el.additional.block === block;
      }
      return false;
    });
  }

  resetDocForms() {
    this.docForms.forEach(f => f.subscription.unsubscribe());
    this.docForms = [];
    this.patItem.documentList.forEach(
      doc => {
        if (!doc.isDeleted) {
          const form = this.sds.makeForm(this.getDocumentDescriptions('documents'));
          let desc = (doc && doc.typeFK && doc.typeFK.id === 336022) ? this.getDocumentDescriptions('documents') : this.getBlockDescriptions('documents'); //делаем до поле для типа полис
          doc.date = new Date(doc.date);
          form.reset(doc);
          this.formCard.enabled ? form.enable({emitEvent: false}) : form.disable({emitEvent: false});
          this.docForms.push({document: doc, form: form, subscription: null, description: desc});
        }
      }
    );
    this.docForms.forEach( //динамически делаем до поле для типа полис
      dc => {
        dc.subscription = dc.form.valueChanges.subscribe(ch => {
          Object.assign(dc.document, ch);
          if (ch && ch.typeFK && ch.typeFK.id === 336022) {
            dc.description = this.getDocumentDescriptions('documents');
          } else {
            dc.description = this.getBlockDescriptions('documents');
          }
        });
      }
    )
  }

  addDocument() {
    let doc = DocumentBean.fromJS({id: 0, isDeleted: false, patient: this.patItem.id});
    let form = this.sds.makeForm(this.getDocumentDescriptions('documents'));
    let desc = this.getBlockDescriptions('documents');
    form.reset(doc);
    this.patItem.documentList.push(doc);
    this.docForms.push({document: doc, form: form, subscription: null, description: desc});
    this.ns.warn('Документ добален', 'Для сохрания данных, необходимо сохранить карту!');
    let dc = this.docForms[this.docForms.length - 1];
    dc.subscription = dc.form.valueChanges.subscribe(ch => {
      Object.assign(dc.document, ch);
      console.log(dc, ch);
      if (ch && ch.typeFK && ch.typeFK.id === 336022) {
        dc.description = this.getDocumentDescriptions('documents');
      } else {
        dc.description = this.getBlockDescriptions('documents');
      }
    });

  }

  deleteDocument(doc: IDocForm, i: number) {
    this.cmodal.confirm('Удаление документа', 'Вы уверены, что хотите удалить документ' + '?').then(
      res => {
        doc.document.isDeleted = true;
        doc.subscription.unsubscribe();
        this.resetDocForms();
        this.ns.warn('Документ удален', 'Для сохрания данных, необходимо сохранить карту!');
      },
      () => {
      }
    );
  }

  savePatient() {
    this.patItem.documentList.forEach(
      doc => {
        if (doc.date) {
          doc.date.setHours(new Date().getTimezoneOffset() / (-60));
        }
      }
    );
    this.patItem.birthday.setHours(new Date().getTimezoneOffset() / (-60));
    console.log(this.patItem);
    this.arch.savePatient(this.patItem).subscribe(
      pat => {
        this.ns.success('Успешно', `Пациент № ${pat.id} сохранен`);
      },
      error1 => {
        this.ns.error('Ошибка!', 'Пациент созранен');
      }
    );
  }

  goToCard(card) {
    this.router.navigate([`/calls/${card.data.call}/card/${card.data.id}`], {relativeTo: this.route});
  }

  fitCol(e) {
    e.api.sizeColumnsToFit();
  }

  ngOnDestroy() {
    this.sbscs.forEach(el => el.unsubscribe());
  }

  getDocumentDescriptions(block: string): ISimpleDescription[] {
    return this.descriptionPatient.filter(el => {
      if (el.additional) {
        return (el.additional.block === block) || (el.additional.block === 'polis');
      }
      return false;
    });
  }
}
