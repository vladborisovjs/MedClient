import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {FormGroup} from '@angular/forms';
import {NotificationsService} from 'angular2-notifications';
import {CardItemService} from '../../services/card-item.service';
import {CardPatientPartDto} from '../../../../../swagger/med-api.service';

@Component({
  selector: 'app-card-side-one-patient',
  templateUrl: './card-side-one-patient.component.html',
  styleUrls: ['./card-side-one-patient.component.scss']
})
export class CardSideOnePatientComponent implements OnInit {
  sbscs: Subscription[] = [];
  cardId: any;
  patient: CardPatientPartDto;
  formPatient: FormGroup;
  descriptionPatient: ISimpleDescription[] = [
    {
      label: 'Фамилия',
      key: 'patient_secondname',
      type: 'text',
      styleClass: 'col-4',
      additional: {
        block: 'general'
      }
    },
    {
      label: 'Имя',
      key: 'patient_firstname',
      type: 'text',
      styleClass: 'col-4',
      additional: {
        block: 'general'
      }
    },
    {
      label: 'Отчество',
      key: 'patient_patronymic',
      type: 'text',
      styleClass: 'col-4',
      additional: {
        block: 'general'
      }
    },
    {
      label: 'Возраст лет',
      key: 'patient_age_years',
      type: 'text',
      styleClass: 'col-4',
      additional: {
        block: 'general'
      }
    },
    {
      label: 'месяцев',
      key: 'patient_age_months',
      type: 'text',
      styleClass: 'col-4',
      additional: {
        block: 'general'
      }
    },
    {
      label: 'дней',
      key: 'patient_age_days',
      type: 'text',
      styleClass: 'col-4',
      additional: {
        block: 'general'
      }
    },
    {
      label: 'Пол',
      key: 'patient_sex',
      type: 'select',
      selectList: [
        {name: 'не указан', id: 0},
        {name: 'мужской', id: 1},
        {name: 'женский', id: 2},
      ],
      styleClass: 'col-4',
      additional: {
        block: 'general'
      }
    },
    {
      label: 'Социальный статус',
      key: 'social_type_name',
      type: 'dict',
      shortDict: true,
      dictFilters: {type: 'PATIENT_SOCIAL_TYPE'},
      dictFiltersOrder: ['type'],
      bindLabel: 'name',
      bindValue: 'id',
      dict: 'readAllUsingGET_34',
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
      shortDict: true,
      dictFilters: {type: 'PATIENT_SOURCE_TYPE'},
      dictFiltersOrder: ['type'],
      bindLabel: 'name',
      bindValue: 'id',
      dict: 'readAllUsingGET_34',
      additional: {
        block: 'personalDoc'
      }
    },
    {
      label: 'Серия',
      key: 'document_serial',
      type: 'text',
      styleClass: 'col-6',
      additional: {
        block: 'personalDoc'
      }
    },
    {
      label: 'Номер',
      key: 'document_number',
      type: 'text',
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
      shortDict: true,
      dictFilters: {type: 'PATIENT_TYPE'},
      dictFiltersOrder: ['type'],
      bindLabel: 'name',
      bindValue: 'id',
      dict: 'readAllUsingGET_34',
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
              private ns: NotificationsService,
              private sds: SimpleDescriptionService) { }

  ngOnInit() {
    this.formPatient = this.sds.makeForm(this.descriptionPatient);
    this.sbscs.push(
      this.route.data.subscribe(data => {
        this.patient = data.patient;
        console.log('->', this.patient);
      }),
      this.route.parent.parent.paramMap.subscribe(data => {
        this.cardId = data.get('cardId');
      })
    );
    this.formPatient.valueChanges.subscribe(
      el => console.log(el)
    );
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

  save() {
    Object.assign(this.patient, this.formPatient.getRawValue());
    console.log('->>', this.patient);
    // this.cas.saveEditCardPatient(this.cardId, this.patient).subscribe(
      // res => {
      //   this.ns.success('Успешно', 'Данные сохранены');
      //   this.back();
      // },
      // err => {
      //   this.ns.error('Ошибка', 'Не удалось сохранить изменения на сервере');
      //   console.log('Save Address', err);
      // }
    // );
  }
}
