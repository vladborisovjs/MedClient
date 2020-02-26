import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {
  ISimpleDescription,
  SimpleDescriptionService
} from '../../../shared/simple-control/services/simple-description.service';
import {FormGroup} from '@angular/forms';
import {NotificationsService} from 'angular2-notifications';
import {CardItemService} from '../../services/card-item.service';
import {
  CallContainer,
  CardBean, DocumentBean,
} from '../../../../../swagger/med-api.service';
import {CallItemService} from '../../../calls/services/call-item.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalAddPatientToCardComponent} from '../modal-add-patient-to-card/modal-add-patient-to-card.component';
import {CustomModalService} from '../../../shared/modal/services/custom-modal.service';
import {debounceTime} from "rxjs/operators";

export interface IDocForm {
  form: FormGroup;
  subscription: Subscription;
  document: DocumentBean;
  description: ISimpleDescription[]
}

@Component({
  selector: 'app-card-side-one-patient',
  templateUrl: './card-side-one-patient.component.html',
  styleUrls: ['./card-side-one-patient.component.scss']
})
export class CardSideOnePatientComponent implements OnInit, OnDestroy {
  sbscs: Subscription[] = [];
  callContainer: CallContainer;
  card: CardBean;
  formPatient: FormGroup; // форма для полей patientBean
  formCard: FormGroup; // форма для полей cardBean
  formPatientTemplate: FormGroup;
  pList: any[] = [];
  descriptionPatient: ISimpleDescription[] = [
    {
      label: 'Пациент вызова',
      key: 'patientTemplateFK',
      type: 'select',
      selectList: this.pList,
      styleClass: 'col-12',
      additional: {
        block: 'patient-template'
      }
    }, // patient-template

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
    }, // patient-info
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
    }, // patient-info
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
    }, // patient-info
    {
      label: 'Пол',
      key: 'gender',
      type: 'select',
      selectList: [
        {name: 'не указан', id: null},
        {name: 'мужской', id: true},
        {name: 'женский', id: false},
      ],
      styleClass: 'col-4',
      additional: {
        block: 'patient-info'
      }
    }, // patient-info
    {
      label: 'Дата рождения',
      key: 'birthday',
      type: 'date',
      showTime: false,
      styleClass: 'col-8',
      yearNavigator: true,
      additional: {
        block: 'patient-info'
      }
    }, // patient-info
    {
      label: 'Тип пациента',
      key: 'patientTypeFK',
      type: 'dict',
      dropdownPosition: 'top',
      dict: 'getReferenceTypeListPatientTypeUsingGET',
      styleClass: 'col-12',
      additional: {
        block: 'patient-info'
      }
    }, // patient-info

    {
      label: 'Регион',
      key: 'region',
      type: 'text',
      styleClass: 'col-6',
      additional: {
        block: 'patient-additional'
      }
    }, // patient-additional
    {
      label: 'Населенный пункт',
      key: 'town',
      type: 'text',
      styleClass: 'col-6',
      additional: {
        block: 'patient-additional'
      }
    }, // patient-additional
    {
      label: 'Улица',
      key: 'street',
      type: 'text',
      additional: {
        block: 'patient-additional'
      }
    }, // patient-additional
    {
      label: 'Дом №',
      key: 'houseNum',
      type: 'text',
      styleClass: 'col-4',
      additional: {
        block: 'patient-additional'
      }
    }, // patient-additional
    {
      label: 'Корпус',
      key: 'buildingNum',
      type: 'text',
      styleClass: 'col-4',
      additional: {
        block: 'patient-additional'
      }
    }, // patient-additional
    {
      label: 'Квартира',
      key: 'flatNum',
      type: 'text',
      styleClass: 'col-4',
      additional: {
        block: 'patient-additional'
      }
    }, // patient-additional
    {
      label: 'Социальный статус',
      key: 'patientSocialStatusFK',
      type: 'dict',
      dict: 'getReferenceTypeListPatientSocialTypeUsingGET',
      styleClass: 'col-12',
      additional: {
        block: 'patient-additional'
      }
    }, // patient-additional
    {
      label: 'Место работы/учебы',
      key: 'workplace',
      type: 'text',
      styleClass: 'col-6',
      additional: {
        block: 'patient-additional'
      }
    }, // patient-additional
    {
      label: 'Должность',
      key: 'post',
      type: 'text',
      styleClass: 'col-6',
      additional: {
        block: 'patient-additional'
      }
    }, // patient-additional

    {
      label: 'Место рождения',
      key: 'alien_birthplace',
      type: 'text',
      styleClass: 'col-8',
      additional: {
        block: 'general'
      }
    },

    {
      label: 'Тип*',
      key: 'typeFK',
      type: 'dict',
      dict: 'getDocumentTypeListUsingGET',
      required: true,
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
      styleClass: 'col-12',
      additional: {
        block: 'polis',
      }
    },
    {
      label: 'Серия',
      key: 'series',
      type: 'text',
      // pattern: '^[0-9]*',
      // errorText: 'Поле не может быть отрицательным',
      styleClass: 'col-6',
      additional: {
        block: 'documents'
      }
    }, // documents
    {
      label: 'Номер',
      key: 'num',
      type: 'number',
      pattern: '^[0-9]*',
      errorText: 'Поле не может быть отрицательным',
      styleClass: 'col-6',
      additional: {
        block: 'documents'
      }
    }, // documents
    {
      label: 'Дата выдачи',
      key: 'date',
      showTime: false,
      type: 'date',
      additional: {
        block: 'documents'
      }
    }, // documents
    {
      label: 'Кем выдан',
      key: 'organization',
      type: 'text',
      additional: {
        block: 'documents'
      }
    }, // documents
    {
      label: 'Примечания',
      key: 'description',
      type: 'textarea',
      additional: {
        block: 'documents'
      }
    }, // documents
  ];
  docForms: IDocForm[] = [];

  constructor(private route: ActivatedRoute, private router: Router,
              private cas: CardItemService,
              private cs: CallItemService,
              private modal: NgbModal,
              private cmodal: CustomModalService,
              private ns: NotificationsService,
              private sds: SimpleDescriptionService) {
  }

  ngOnInit() {
    this.formCard = this.sds.makeForm(this.getBlockDescriptions('patient-additional'));
    this.formPatientTemplate = this.sds.makeForm(this.getBlockDescriptions('patient-template'));
    this.formPatient = this.sds.makeForm(this.getBlockDescriptions('patient-info'));

    this.sbscs.push(
      this.cas.isEditingSub.subscribe(s => {
        if (s === 'disable' || s === 'loading') {
          this.formPatientTemplate.disable({emitEvent: false});
          this.formCard.disable({emitEvent: false});
          this.formPatient.disable({emitEvent: false});
          this.docForms.forEach(df => df.form.disable({}));
        } else {
          this.formPatientTemplate.enable({emitEvent: false});
          if (this.card && this.card.patientFK) {
            this.formCard.enable({emitEvent: false});
            this.formPatient.enable({emitEvent: false});
            this.docForms.forEach(df => df.form.enable({}));
          }
        }
      }),
      this.cs.callItemSub.pipe().subscribe(call => {
          this.callContainer = call;
          if (this.callContainer.call.patientList) {
            this.callContainer.call.patientList.forEach(
              p => {
                if (!p.isDeleted) {
                  this.pList.push(
                    {
                      name: (p.surname || p.name || p.patronymic) ? (p.surname || '') + ' ' +
                        (p.name || '') + ' ' + (p.patronymic || '') : 'Не заполнено',
                      id: p.id
                    }
                  );
                }
              }
            );
          }
        }
      ),
      this.cas.cardItemSub.subscribe(card => {
          this.card = card;
          if (card.patientTemplateFK) { // Если выбран пациент карты отображаем соответсвуещее значение из pList
            if (this.pList.find((v) => v.id === this.card.patientTemplateFK.id)) {
              this.formPatientTemplate.controls['patientTemplateFK']
                .setValue(this.pList.find((v) => v.id === this.card.patientTemplateFK.id).id);
            }
          }
          if (this.card.patientFK) {
            this.formPatient.reset(this.card.patientFK);
            this.formCard.reset(this.card);
            this.resetDocForms();
          } else {
            this.formPatient.disable({emitEvent: false});
            this.formCard.disable({emitEvent: false});
          }
        }
      ),
      this.formCard.valueChanges.subscribe(ch => Object.assign(this.card, ch)),
      this.formPatientTemplate.valueChanges.subscribe(ch => {
        this.card.patientTemplateFK = this.callContainer.call.patientList.find(p => p.id === ch.patientTemplateFK);
      }),
      this.formPatient.valueChanges.subscribe(ch => Object.assign(this.card.patientFK, ch))
    );
    ['name', 'surname', 'patronymic'].forEach(
      key => {
        this.sbscs.push(
          this.formPatient.controls[key].valueChanges.subscribe(
            name => {
              if (name) {
                this.formPatient.controls[key].reset(
                  name[0].toLocaleUpperCase() + name.slice(1), {emitEvent: false}
                );
              }
            }
          )
        );
      }
    );

  }

  ngOnDestroy() {
    this.sbscs.forEach(el => el.unsubscribe());
    this.docForms.forEach(f => f.subscription.unsubscribe());
  }

  resetDocForms() {
    this.docForms.forEach(f => f.subscription.unsubscribe());
    this.docForms = [];
    this.card.patientFK.documentList.forEach(
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
    let doc = DocumentBean.fromJS({id: 0, isDeleted: false, patient: this.card.patientFK.id});
    let form = this.sds.makeForm(this.getDocumentDescriptions('documents'));
    let desc = this.getBlockDescriptions('documents');
    form.reset(doc);
    this.card.patientFK.documentList.push(doc);
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

  back() {
    this.router.navigate(['../'], {relativeTo: this.route.parent});
  }

  openPatientsArchive() {
    const archive = this.modal.open(ModalAddPatientToCardComponent, {size: 'lg'});
    archive.componentInstance.filter = this.card.patientTemplateFK || {};
    archive.result.then(
      res => {
        if (res) {
          res.birthday = res.birthday ? new Date(res.birthday) : null;
          this.card.patientFK = res;
          if (res.id) {
            this.formPatient.reset(this.card.patientFK);
            this.resetDocForms();
          } else {
            // this.formPatient.reset(this.card.patientTemplateFK);
            this.formPatient.reset(this.card.patientFK);
          }
          this.formPatient.enable({emitEvent: false});
          this.docForms.forEach(df => df.form.enable({emitEvent: false}));
          this.formCard.enable({emitEvent: false});
          this.ns.warn('Пациент добален', 'Для сохрания данных пациента, необходимо сохранить карту!');
        }
      }
    );
  }


  getBlockDescriptions(block: string): ISimpleDescription[] {
    return this.descriptionPatient.filter(el => {
      if (el.additional) {
        return el.additional.block === block;
      }
      return false;
    });
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
