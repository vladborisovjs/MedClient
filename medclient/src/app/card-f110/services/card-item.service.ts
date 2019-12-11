import {Inject, Injectable} from '@angular/core';
import {
  API_BASE_URL,
  CardBean,
  CardResultBean,
  MedApi,
  Status
} from '../../../../swagger/med-api.service';
import {BehaviorSubject} from 'rxjs';
import {UserService} from '../../services/user.service';
import {map, take, tap} from 'rxjs/operators';
import {NotificationsService} from 'angular2-notifications';
import {CallItemService} from '../../calls/services/call-item.service';
import {TeldaNgLocksService} from "telda-ng-locks";

@Injectable()
export class CardItemService {
  isEditingSub: BehaviorSubject<'disable'|'editing'|'loading'>;
  isEditing: 'disable'|'editing'|'loading';
  cardItemSub: BehaviorSubject<CardBean>;
  cardItem: CardBean;
  constructor(private api: MedApi, private user: UserService,
              private ns: NotificationsService,
              private cis: CallItemService,
              private locksService: TeldaNgLocksService,
              @Inject(API_BASE_URL) private apiUrl?: string) {
    this.isEditingSub = new BehaviorSubject<'disable'|'editing'|'loading'>('disable');
    this.isEditingSub.subscribe(value => this.isEditing = value);
    this.cardItemSub = new BehaviorSubject<CardBean>(null);
    this.cardItemSub.subscribe(card => this.cardItem = card);
    console.log('constr', this.cardItem);
  }

  unlockCard(){
    if (this.isEditing === 'editing') return;
    this.isEditingSub.next('loading');
    this.locksService.startLock(this.cardItem.id).pipe(take(1)).subscribe(
      value => {
        if (value.result.success){
          this.isEditingSub.next('editing');
        } else {
          this.isEditingSub.next('disable');
          this.ns.warn(null, `Карта редактируется пользователем ${value.result.locker}`);
        }
      }
    );
  }

  lockCard(){
    if (this.isEditing === 'disable') return;
    this.isEditingSub.next('loading');
    this.locksService.unlock().pipe(take(1)).subscribe(
      value =>  this.isEditingSub.next('disable')
    );

  }

  getCard(cardId) {
    return this.api.getCardUsingGET(cardId).pipe(tap(
      (card: CardBean) => {
        console.log('card loaded', card);
        card.cardResultBean = card.cardResultBean ? card.cardResultBean : CardResultBean.fromJS({});
        this.cardItemSub.next(card);
      }
      )
    );
  }

  saveCard() {
    this.cardItem.dateClose = new Date(); // todo-vlad: это должен делать сервер
    console.log(this.cis.callItemSub);
    console.log('--->', this.cardItem);
    this.cardItem = CardBean.fromJS(this.cardItem);
    this.cardItem.patientFK && this.cardItem.patientFK.documentList && this.cardItem.patientFK.documentList.forEach(
      doc => {
        if (doc.date) {
          doc.date.setHours(new Date().getTimezoneOffset() / (-60));
        }
      }
    );
    this.cardItem.patientFK && this.cardItem.patientFK.birthday &&
    this.cardItem.patientFK.birthday.setHours(new Date().getTimezoneOffset() / (-60));
    console.log('--->2', this.cardItem);
    this.cardItem.cardResultBean && (this.cardItem.cardResultBean.id = this.cardItem.id);
    this.isEditingSub.next('loading'); // блокируем кнопку на сохранении
    this.api.updateCardUsingPOST(this.cardItem).subscribe(
      card => {
        this.cardItemSub.next(card);
        console.log('<---', this.cardItem);
        this.ns.success('Успешно', 'Карта сохранена');
        this.lockCard();
      }
    );
  }

  getBagDrugs() {
    return this.api.getUniqueDrugsForBrigadeUsingGET(this.cardItem.brigadeFK.id).pipe(
      map(bList => {
          const selectList: { id: any, name: string }[] = [];
          bList.forEach(
            drug => {
              selectList.push({
                id: drug.first, name: drug.first.name + ' - '
                + drug.second + ' '
                + (drug.first.measurementFK ? drug.first.measurementFK.name : 'ед')
              });
            }
          );
          return selectList;
        }
      )
    );
  }

  getBags() {
    return this.api.listBagsOfBrigadeUsingGET(this.cardItem.brigadeFK.id).pipe(
      map(bList => {
          const selectList: { id: any, name: string }[] = [];
          bList.list.forEach(
            bag => {
              selectList.push({
                id: bag.id, name: bag.name
              });
            }
          );
          return selectList;
        }
      )
    );
  }

  getBag(id) {
    return this.api.getTmpBagUsingGET(id);
  }

  printReport(type: string) {
    switch (type) {
      case 'f110': {
        window.open(this.apiUrl + `/api/andy/reports/callCard?id=${this.cardItem.id}`);
        break;
      }
      case 'carrySheet': {
        window.open(this.apiUrl + `/api/andy/reports/carrySheet?id=${this.cardItem.id}`);
        break;
      }
    }

  }

  findSimularPatient(offset, count, filter) {
    return this.api.getSimilarPatientListUsingGET(
      offset, count,
      filter.name || undefined,
      filter.surname || undefined,
      filter.patronymic || undefined,
      filter.fullAge || undefined,
      filter.fullMonth || undefined,
      filter.fullDay || undefined
    );
  }

  setCardStatus(status: Status){
    return this.api.updateCardStatusUsingPOST(this.cardItem.id, status).pipe(tap(
      status => {
        this.cardItem.cardStatus = status;
        console.log('status', status);
        this.cardItemSub.next(this.cardItem);
      }
    ));
  }

}


