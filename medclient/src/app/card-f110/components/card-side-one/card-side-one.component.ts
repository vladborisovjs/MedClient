import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {BrigadeBean, BrigadeContainer, CallContainer, CardBean} from '../../../../../swagger/med-api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {IPlateInfo} from '../../../shared/info-plate/components/info-plate/info-plate.component';
import {
  ISimpleDescription,
  SimpleDescriptionService
} from '../../../shared/simple-control/services/simple-description.service';
import {FormGroup} from '@angular/forms';
import {CardItemService} from '../../services/card-item.service';
import {NotificationsService} from 'angular2-notifications';
import {CallItemService} from '../../../calls/services/call-item.service';
import {take} from "rxjs/operators";

@Component({
  selector: 'app-card-side-one',
  templateUrl: './card-side-one.component.html',
  styleUrls: ['./card-side-one.component.scss', '../../../shared/info-plate/components/info-plate/info-plate.component.scss']
})
export class CardSideOneComponent implements OnInit, OnDestroy {
  sbscs: Subscription[] = [];
  card: CardBean;
  callContainer: CallContainer;
  plateProp: IPlateInfo[] = [
    // card
    {
      title: 'Номер: ', field: 'number', type: 'number', block: 'card'
    },
    {
      title: 'Дата и время: ', field: 'date', type: 'date', block: 'card', datePipeFormat: 'dd.MM.yyyy HH:mm'
    },
    {
      title: 'Подразделение: ', field: 'subdivisionFK', subField: 'name', type: 'bean', block: 'card'
    },
    {
      title: 'Сотрудник: ', field: 'performerFK', subField: 'surname', type: 'bean', block: 'card'
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
    {
      title: 'Место получения: ', field: 'placeTypeFK', subField: 'name', type: 'bean', block: 'call'
    },

    // patient
    {
      title: 'Возраст: ', field: 'ageYears', type: 'text', block: 'patient'
    },

    // address
    {
      title: 'Место вызова: ', field: 'placeTypeFK', subField: 'name', type: 'bean', block: 'address'
    },
    {
      title: 'Адрес: ', field: 'address', type: 'text', block: 'address'
    },
    {
      title: 'Дом:', field: 'houseNum', type: 'text', block: 'address'
    },
    {
      title: 'Подъезд:', field: 'entranceNum', type: 'text', block: 'address'
    },
    {
      title: 'Домофон:', field: 'entranceCode', type: 'text', block: 'address'
    },
    {
      title: 'Квартира:', field: 'flatNum', type: 'text', block: 'address'
    },

    // declarant
    {
      title: 'Фио: ', field: 'declarantName', type: 'text', block: 'declarant'
    },
    {
      title: 'Телефон: ', field: 'declarantPhone', type: 'text', block: 'declarant'
    },
    {
      title: 'Тип: ', field: 'declarantTypeFK', subField: 'name', type: 'bean', block: 'declarant'
    },

    // brigade
    {
      title: 'Название: ', field: 'name', type: 'text', block: 'brigade'
    },

    // briPerformer
    {
      title: 'Имя:', field: 'name', type: 'text', block: 'briPerformer'
    },
    {
      title: 'Должность:', field: 'typeFK', subField: 'name', type: 'bean', block: 'briPerformer'
    },

    // time
    {
      title: 'Превышено время прибытия:', field: 'arriveTimeExceed', type: 'boolean', block: 'time'
    },
    {
      title: 'Превышено время приема:', field: 'receivingTimeExceed', type: 'boolean', block: 'time'
    },

  ];
  messagesHistory = [];
  brigadeContainer: BrigadeContainer;

  constructor(
    private cas: CardItemService,
    private cs: CallItemService,
    private route: ActivatedRoute,
    private sds: SimpleDescriptionService,
    private router: Router,
    private ns: NotificationsService) {
  }

  ngOnInit() {
    this.sbscs.push(
      this.cs.callItemSub.subscribe(call => this.callContainer = call),
      this.cas.cardItemSub.subscribe(card => {
          this.card = card;
          if (card){
            this.cs.getBrigadesMessages(this.card.brigadeFK.id, this.callContainer.call.id).pipe(take(1)).subscribe( // todo: мб перенсти в резолвер
              h => this.messagesHistory = h);
            this.findBrigadesPerformer();
          }

        }
      ),
    );
  }

  ngOnDestroy() {
    this.sbscs.forEach(el => el.unsubscribe());
  }

  findBrigadesPerformer(){ // из callcontainer достаем бригаду  карты
    if (this.callContainer){
      this.brigadeContainer = this.callContainer.brigadeList.find(b => b.brigade.id === this.card.brigadeFK.id);
    }
  }

  getPlateDescriptions(block: string): IPlateInfo[] {
    return this.plateProp.filter(el => {
      if (el.block) {
        return el.block === block;
      }
      return false;
    });
  }
}
