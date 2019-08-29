import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {FormGroup} from '@angular/forms';
import {NotificationsService} from 'angular2-notifications';
import {CardItemService} from '../../services/card-item.service';
import {CallBean, CallContainer, CardBean, CardPatientPartDto, PatientBean} from '../../../../../swagger/med-api.service';
import {CallItemService} from '../../services/call-item.service';

@Component({
  selector: 'app-card-side-one-patient',
  templateUrl: './card-side-one-patient.component.html',
  styleUrls: ['./card-side-one-patient.component.scss']
})
export class CardSideOnePatientComponent implements OnInit, OnDestroy {
  sbscs: Subscription[] = [];
  callContainer: CallContainer;
  card: CardBean;
  formPatient: FormGroup;
  pList: any[] = [];
  descriptionPatient: ISimpleDescription[] = [
    {
      label: 'Пациент вызова',
      key: '',
      type: 'select',
      selectList: this.pList,
      styleClass: 'col-12',
      additional: {
        block: 'general'
      }
    },
    {
      label: 'Фамилия',
      key: 'surname',
      type: 'text',
      errorText: 'Только кириллица',
      pattern: '^[а-яА-ЯёЁ\\s-]*',
      styleClass: 'col-12',
      additional: {
        block: 'general'
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
        block: 'general'
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
        block: 'general'
      }
    },
    {
      label: 'Возраст лет',
      key: 'ageYears',
      type: 'number',
      pattern: '^[0-9]*',
      errorText: 'Поле не может быть отрицательным',
      styleClass: 'col-12',
      additional: {
        block: 'general'
      }
    },
    {
      label: 'Месяцев',
      key: 'ageMonths',
      type: 'number',
      pattern: '^[0-9]*',
      errorText: 'Поле не может быть отрицательным',
      styleClass: 'col-12',
      additional: {
        block: 'general'
      }
    },
    {
      label: 'Дней',
      key: 'ageDays',
      type: 'number',
      pattern: '^[0-9]*',
      errorText: 'Поле не может быть отрицательным',
      styleClass: 'col-12',
      additional: {
        block: 'general'
      }
    },
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
        block: 'general'
      }
    },
    {
      label: 'Социальный статус',
      key: 'patientFK',
      type: 'dict',
      dict: 'getReferenceTypeListPatientSocialTypeUsingGET',
      styleClass: 'col-4',
      additional: {
        block: 'general'
      }
    },
    {
      label: 'Место рождения',
      key: 'alien_birthplace',
      type: 'text',
      styleClass: 'col-4',
      additional: {
        block: 'general'
      }
    },
    {
      label: 'Тип',
      key: 'source_type_name',
      type: 'dict',
      bindValue: 'id',
      dict: 'getReferenceTypeListPatientSourceTypeUsingGET',
      additional: {
        block: 'personalDoc'
      }
    },
    {
      label: 'Серия',
      key: 'document_serial',
      type: 'number',
      pattern: '^[0-9]*',
      errorText: 'Поле не может быть отрицательным',
      styleClass: 'col-6',
      additional: {
        block: 'personalDoc'
      }
    },
    {
      label: 'Номер',
      key: 'document_number',
      type: 'number',
      pattern: '^[0-9]*',
      errorText: 'Поле не может быть отрицательным',
      styleClass: 'col-6',
      additional: {
        block: 'personalDoc'
      }
    },
    {
      label: 'Дата выдачи',
      key: 'document_date',
      type: 'date',
      additional: {
        block: 'personalDoc'
      }
    },
    {
      label: 'Страна',
      key: 'registry_country',
      type: 'text',
      styleClass: 'col-6',
      additional: {
        block: 'address'
      }
    },
    {
      label: 'Регион',
      key: 'registry_region',
      type: 'text',
      styleClass: 'col-6',
      additional: {
        block: 'address'
      }
    },
    {
      label: 'Город/село',
      key: 'registry_city',
      type: 'text',
      styleClass: 'col-6',
      additional: {
        block: 'address'
      }
    },
    {
      label: 'Район',
      key: 'registry_district',
      type: 'text',
      styleClass: 'col-6',
      additional: {
        block: 'address'
      }
    },
    {
      label: 'Улица',
      key: 'registry_street',
      type: 'text',
      additional: {
        block: 'address'
      }
    },
    {
      label: 'Дом',
      key: 'registry_house',
      type: 'text',
      styleClass: 'col-4',
      additional: {
        block: 'address'
      }
    },
    {
      label: 'Корпус',
      key: 'registry_building',
      type: 'text',
      styleClass: 'col-4',
      additional: {
        block: 'address'
      }
    },
    {
      label: 'Квартира',
      key: 'registry_flat',
      type: 'text',
      styleClass: 'col-4',
      additional: {
        block: 'address'
      }
    },
    {
      label: 'Тип',
      key: 'patient_type_name',
      type: 'dict',
      dict: 'getReferenceTypeListPatientTypeUsingGET',
      additional: {
        block: 'address'
      }
    },
    {
      label: 'Место работы/учебы',
      key: 'job_place',
      type: 'text',
      additional: {
        block: 'occupation'
      }
    },
    {
      label: 'Должность',
      key: 'job_position',
      type: 'text',
      additional: {
        block: 'occupation'
      }
    },
    {
      label: 'Полис ОМС',
      key: 'insurance_OMS',
      type: 'text',
      additional: {
        block: 'insurance'
      }
    },
    {
      label: 'СМО',
      key: 'insurance_SMO',
      type: 'text',
      additional: {
        block: 'insurance'
      }
    },
    {
      label: 'Полис ДМС, СМО',
      key: 'insurance_DMS_SMO',
      type: 'text',
      additional: {
        block: 'insurance'
      }
    },
  ];

  constructor(private route: ActivatedRoute, private router: Router,
              private cas: CardItemService,
              private cs: CallItemService,
              private ns: NotificationsService,
              private sds: SimpleDescriptionService) {
  }

  ngOnInit() {
    this.formPatient = this.sds.makeForm(this.descriptionPatient);
    this.sbscs.push(
      this.cs.callItemSub.subscribe(call => {
          this.callContainer = call;
          if (this.callContainer.patientList) {
            this.callContainer.patientList.forEach(
              p => this.pList.push(
                {name: p.surname + ' ' + p.name + ' ' + p.patronymic, id: p.id}
              )
            );
          }
        }
      ),
      this.cas.cardItemSub.subscribe(card => {
          this.card = card;
          this.card.patientFK = this.card.patientFK ? this.card.patientFK : PatientBean.fromJS({});
        }
      ),
      this.formPatient.valueChanges.subscribe(ch => {
        this.cas.formPatient = this.formPatient.invalid;
        Object.assign(this.card.patientFK, ch);
      }),
    );
    this.formPatient.reset(this.card.patientFK)
  }

  ngOnDestroy() {
    this.sbscs.forEach(el => el.unsubscribe());
  }

  back() {
    this.router.navigate(['../'], {relativeTo: this.route.parent});
  }


  getBlockDescriptions(block: string): ISimpleDescription[] {
    return this.descriptionPatient.filter(el => {
      if (el.additional) {
        return el.additional.block === block;
      }
      return false;
    });
  }
}
