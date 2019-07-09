import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {CardSideOneDto} from '../../../../../swagger/med-api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {IPlateInfo} from '../../../shared/info-plate/components/info-plate/info-plate.component';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {FormGroup} from '@angular/forms';
import {CardItemService} from '../../services/card-item.service';
import {NotificationsService} from 'angular2-notifications';

@Component({
  selector: 'app-card-side-one',
  templateUrl: './card-side-one.component.html',
  styleUrls: ['./card-side-one.component.scss', '../../../shared/info-plate/components/info-plate/info-plate.component.scss']
})
export class CardSideOneComponent implements OnInit, OnDestroy {
  sbscs: Subscription[] = [];
  cardInfoSideOne: CardSideOneDto;
  plateProp: IPlateInfo[] = [
    // card
    {
      title: 'Номер: ', field: 'number', type: 'number', block: 'card'
    },
    {
      title: 'Дата и время: ', field: 'basic_dates', subField: 'call_date', type: 'bean', block: 'card', datePipeFormat: 'dd.MM.yyyy HH:mm'
    },
    {
      title: 'Подразделение: ', field: 'subdivision_name', type: 'text', block: 'card'
    },
    {
      title: 'Сотрудник: ', field: 'performer_name', type: 'text', block: 'card'
    },

    // call
    {
      title: 'Номер: ', field: 'call_number', type: 'number', block: 'call'
    },
    {
      title: 'Тип: ', field: 'call_type_name', type: 'text', block: 'call'
    },
    {
      title: 'Повод: ', field: 'reason_name', type: 'text', block: 'call'
    },
    {
      title: 'Описание: ', field: 'reason_comment', type: 'text', block: 'call'
    },
    {
      title: 'Приоритет: ', field: 'call_priority_name', type: 'text', block: 'call'
    },
    {
      title: 'Место получения: ', field: 'receiving_type_name', type: 'text', block: 'call'
    },

    // patient
    // {
    //   title: 'Фио: ', field: 'patient_secondname',  type: 'text', block: 'patient'
    // },
    {
      title: 'Пол: ', field: 'patient_sex_name',   type: 'text', block: 'patient'
    },
    {
      title: 'Возраст: ', field: 'patient_age_years',   type: 'text', block: 'patient'
    },

    // address
    {
      title: 'Район: ', field: 'district', subField: 'name',  type: 'bean', block: 'address'
    },
    {
      title: 'Адрес: ', field: 'fullname', type: 'text', block: 'address'
    },
    {
      title: 'Место вызова: ', field: 'call_place_name', type: 'text', block: 'address'
    },

    // declarant
    {
      title: 'Фио: ', field: 'declarant_name',   type: 'text', block: 'declarant'
    },
    {
      title: 'Телефон: ', field: 'declarant_phone',   type: 'text', block: 'declarant'
    },
    {
      title: 'Тип: ', field: 'declarant_type_name',   type: 'text', block: 'declarant'
    },

    // brigade
    {
      title: 'Название: ', field: 'name',   type: 'text', block: 'brigade'
    },

    // briPerformer
    {
      title: 'Имя:', field: 'short_name',   type: 'text', block: 'briPerformer'
    },
    {
      title: 'Должность:', field: 'type_name',   type: 'text', block: 'briPerformer'
    },

    // time
    {
      title: 'Превышено время прибытия:', field: 'arrive_time_exceed',   type: 'boolean', block: 'time'
    },
    {
      title: 'Превышено время приема:', field: 'receiving_time_exceed',   type: 'boolean', block: 'time'
    },

    ];
  descriptions: ISimpleDescription[] = [
    {
      label: 'Вызов принят:',
      key: 'brigade_receiving_date',
      type: 'date',
      styleClass: 'col-6'
    },
    {
      label: 'Бригада выехала:',
      key: 'brigade_departure_date',
      type: 'date',
      styleClass: 'col-6'
    },
    {
      label: 'Бригада прибыла:',
      key: 'brigade_arrive_date',
      type: 'date',
      styleClass: 'col-6'
    },
    {
      label: 'Начало транспортировки:',
      key: 'brigade_transport_begin_date',
      type: 'date',
      styleClass: 'col-6'
    },
    {
      label: 'Окончание транспортировки:',
      key: 'brigade_transport_end_date',
      type: 'date',
      styleClass: 'col-6'
    },
    {
      label: 'Завершение вызова:',
      key: 'brigade_complete_date',
      type: 'date',
      styleClass: 'col-6'
    },
    {
      label: 'Возвращение на станцию:',
      key: 'brigade_return_date',
      type: 'date',
      styleClass: 'col-6'
    },
  ];
  form: FormGroup;

  constructor(
    private cas: CardItemService,
    private route: ActivatedRoute,
    private sds: SimpleDescriptionService,
    private router: Router,
    private ns: NotificationsService) { }

  ngOnInit() {
    this.form = this.sds.makeForm(this.descriptions);
    this.sbscs.push(
      this.route.data.subscribe(data => {
        this.cardInfoSideOne = data.cardInfo;
        console.log('->', this.cardInfoSideOne);
      })
    );
    this.updatePatient();
  }

  ngOnDestroy() {
    this.sbscs.forEach(el => el.unsubscribe());
  }

  updatePatient() {
    this.cas.getPatient(this.cardInfoSideOne.general.card_id).subscribe(
      data => {
        this.cardInfoSideOne.patient = data;
      }
    );
    console.log(this.cardInfoSideOne.patient);
  }

  updateCD() {
    console.log(this.form.getRawValue());
    Object.assign(this.cardInfoSideOne.general.basic_dates, this.form.getRawValue());
    this.cas.updateChronology(this.cardInfoSideOne.general.card_id, this.cardInfoSideOne.general.basic_dates).subscribe(
      res => {
        this.ns.success('Успешно', 'Данные обновлены');
      },
      err => {
        this.ns.error('Ошибка', 'Не удалось сохранить изменения на сервере');
        console.log('Save Dates', err);
      }
    );
  }
  getPlateDescriptions(block: string): IPlateInfo[] {
    return this.plateProp.filter(el => {
      if (el.block) {
        return el.block === block;
      }
      return false;
    });
  }

  goToPatient() {
    this.router.navigate(['patient'], {relativeTo: this.route.parent});
  }

}
