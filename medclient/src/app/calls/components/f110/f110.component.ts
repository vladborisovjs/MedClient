import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {CustomModalService} from '../../../shared/modal/services/custom-modal.service';
import {CardItemService} from '../../services/card-item.service';
import {NotificationsService} from 'angular2-notifications';
import {CallDto, CardSideOneDto} from '../../../../../swagger/med-api.service';

@Component({
  selector: 'app-f110',
  templateUrl: './f110.component.html',
  styleUrls: ['./f110.component.scss']
})
export class F110Component implements OnInit, OnDestroy {
  sbscs: Subscription[] = [];
  cardInfoSideOne: any;
  constructor(
    private route: ActivatedRoute,
    private cmodal: CustomModalService,
    private cas: CardItemService,
    private ns: NotificationsService) {
  }

  ngOnInit() {
    this.sbscs.push(
      this.route.data.subscribe(data => {
        this.cardInfoSideOne = data;
        console.log(this.cardInfoSideOne);

      })
    );
  // console.log('cardId', this.route.snapshot.url[0].path);
  // console.log('callId', this.route.parent.parent.snapshot.url[0].path);
  }

  ngOnDestroy() {
    this.sbscs.forEach(el => el.unsubscribe());
  }

  saveCard(){
    if (this.cas.formResult || this.cas.formTypeResult) {
      this.ns.error('Ошибка заполнения формы результата', 'Данные не сохранены');
    }
    if(this.cas.formObjectives) {
      this.ns.error('Ошибка заполнения формы объективных данных', 'Данные не сохранены');
    }
    if (this.cas.formPatient) {
      this.ns.error('Ошибка заполнения формы пациента', 'Данные не сохранены');
    }
    if (!this.cas.formResult && !this.cas.formObjectives && !this.cas.formPatient && !this.cas.formTypeResult) {
      this.cas.saveCard();
    }
  }

  requestToCheck() {
    this.cmodal.confirm('Отправление карточки на проверкку', 'Подтвердите отправление карточки на проверку').then(
      res => {
        if (res) {
          this.cas.saveRequestCheck().subscribe(
            ans => {
              this.ns.success('Успешно', 'Данные переданы');
            },
            err => {
              this.ns.error('Ошибка', 'Не удалось удалить пациента');
            }

          );
        }
      },
      () => {}
    );
  }

}
