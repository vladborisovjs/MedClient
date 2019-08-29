import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {CallBean, CallContainer, CardBean, CardSideOneDto} from '../../../../../swagger/med-api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {IPlateInfo} from '../../../shared/info-plate/components/info-plate/info-plate.component';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {FormGroup} from '@angular/forms';
import {CardItemService} from '../../services/card-item.service';
import {NotificationsService} from 'angular2-notifications';
import {CallItemService} from '../../services/call-item.service';

@Component({
  selector: 'app-card-side-one',
  templateUrl: './card-side-one.component.html',
  styleUrls: ['./card-side-one.component.scss', '../../../shared/info-plate/components/info-plate/info-plate.component.scss']
})
export class CardSideOneComponent implements OnInit, OnDestroy {
  sbscs: Subscription[] = [];
  card: CardBean;
  callContainer: CallContainer;
  cardInfoSideOne: CardSideOneDto;
  plateProp: IPlateInfo[] = [
    // card
    {
      title: 'Номер: ', field: 'number', type: 'number', block: 'card'
    },
    {
      title: 'Дата и время: ', field: 'date', type: 'date', block: 'card', datePipeFormat: 'dd.MM.yyyy HH:mm'
    },
    {
      title: 'Подразделение: ', field: 'subdivisionFK', subField: 'name',  type: 'bean', block: 'card'
    },
    {
      title: 'Сотрудник: ', field: 'performerFK', subField: 'surname',  type: 'bean', block: 'card'
    },

    // call
    {
      title: 'Номер: ', field: 'number', type: 'number', block: 'call'
    },
    {
      title: 'Тип: ', field: 'typeFK', subField: 'name', type: 'bean', block: 'call'
    },
    {
      title: 'Повод: ', field: 'reasonFK', subField: 'reason', type: 'bean', block: 'call'
    },
    {
      title: 'Описание: ', field: 'reasonComment', type: 'text', block: 'call'
    },
    // {
    //   title: 'Приоритет: ', field: 'priority', type: 'text', block: 'call'
    // },
    {
      title: 'Место получения: ', field: 'brigadeReceivingPlaceFK', subField: 'name', type: 'bean', block: 'call'
    },

    // patient
    // {
    //   title: 'Фио: ', field: 'patient_secondname',  type: 'text', block: 'patient'
    // },
    // {
    //   title: 'Пол: ', field: 'gender',   type: 'text', block: 'patient'
    // },
    {
      title: 'Возраст: ', field: 'ageYears',   type: 'text', block: 'patient'
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
      title: 'Фио: ', field: 'declarantName',   type: 'text', block: 'declarant'
    },
    {
      title: 'Телефон: ', field: 'declarantPhone',   type: 'text', block: 'declarant'
    },
    {
      title: 'Тип: ', field: 'declarantTypeFK', subField: 'name',  type: 'bean', block: 'declarant'
    },

    // brigade
    {
      title: 'Название: ', field: 'name',   type: 'text', block: 'brigade'
    },

    // briPerformer
    {
      title: 'Имя:', field: 'name',   type: 'text', block: 'briPerformer'
    },
    {
      title: 'Должность:', field: 'typeFK', subField: 'name',  type: 'bean', block: 'briPerformer'
    },

    // time
    {
      title: 'Превышено время прибытия:', field: 'arriveTimeExceed',   type: 'boolean', block: 'time'
    },
    {
      title: 'Превышено время приема:', field: 'receivingTimeExceed',   type: 'boolean', block: 'time'
    },

    ];
  descriptions: ISimpleDescription[] = [
    {
      label: 'Вызов принят:',
      key: 'brigadeReceivingDate',
      type: 'date',
      styleClass: 'col-6'
    },
    {
      label: 'Бригада выехала:',
      key: 'brigadeDepartureDate',
      type: 'date',
      styleClass: 'col-6'
    },
    {
      label: 'Бригада прибыла:',
      key: 'brigadeArriveDate',
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
      key: 'brigadeDoneDate',
      type: 'date',
      styleClass: 'col-6'
    },
    {
      label: 'Возвращение на станцию:',
      key: 'brigadeReturnDate',
      type: 'date',
      styleClass: 'col-6'
    },
  ];
  form: FormGroup;

  constructor(
    private cas: CardItemService,
    private cs: CallItemService,
    private route: ActivatedRoute,
    private sds: SimpleDescriptionService,
    private router: Router,
    private ns: NotificationsService) { }

  ngOnInit() {
    // this.form = this.sds.makeForm(this.descriptions);
    this.sbscs.push(
      this.cs.callItemSub.subscribe(call => this.callContainer = call),
      this.cas.cardItemSub.subscribe(card => this.card = card),
    );
    console.log(this.card);
    console.log(this.callContainer);
    // this.updatePatient();
  }

  ngOnDestroy() {
    this.sbscs.forEach(el => el.unsubscribe());
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
