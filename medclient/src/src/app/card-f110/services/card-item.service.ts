import {Inject, Injectable} from '@angular/core';
import {API_BASE_URL, CardBean, CardResultBean, MedApi, Status} from '../../../../swagger/med-api.service';
import {BehaviorSubject} from 'rxjs';
import {UserService} from '../../services/user.service';
import {map, take, tap} from 'rxjs/operators';
import {NotificationsService} from 'angular2-notifications';
import {CallItemService} from '../../calls/services/call-item.service';
import {TeldaNgLocksService} from "telda-ng-locks";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CustomModalService} from "../../shared/modal/services/custom-modal.service";
import {ModalCardValidWarnComponent} from "../components/modal-card-valid-warn/modal-card-valid-warn.component";
import {ActivatedRoute, Router} from "@angular/router";

@Injectable()
export class CardItemService {
  isEditingSub: BehaviorSubject<'disable' | 'editing' | 'loading'>;
  isEditing: 'disable' | 'editing' | 'loading';
  cardItemSub: BehaviorSubject<CardBean>;
  cardItem: CardBean;
  isArrived = false;

  constructor(private api: MedApi, private user: UserService,
              private ns: NotificationsService,
              private cis: CallItemService,
              private cmodal: CustomModalService,
              private locksService: TeldaNgLocksService,
              private route: ActivatedRoute,
              private router: Router,
              @Inject(API_BASE_URL) private apiUrl?: string) {
    this.isEditingSub = new BehaviorSubject<'disable' | 'editing' | 'loading'>('disable');
    this.isEditingSub.subscribe(value => this.isEditing = value);
    this.cardItemSub = new BehaviorSubject<CardBean>(null);
    this.cardItemSub.subscribe(card => this.cardItem = card);
    console.log('constr', this.cardItem);
  }

  unlockCard() {
    if (this.isEditing === 'editing') return;
    this.isEditingSub.next('loading');
    this.locksService.startLock(this.cardItem.id).pipe(take(1)).subscribe(
      value => {
        if (value.result.success) {
          this.isEditingSub.next('editing');
        } else {
          this.isEditingSub.next('disable');
          this.ns.warn(null, `Карта редактируется пользователем ${value.result.locker}`);
        }
      },
      error => {
        this.isEditingSub.next('disable');
      }
    );
  }

  lockCard() {
    if (this.isEditing === 'disable') return;
    this.isEditingSub.next('loading');
    this.locksService.unlock().pipe(take(1)).subscribe(
      value => this.isEditingSub.next('disable')
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

  getBagDrugs(id) {
    return this.api.getDrugsFromBagUsingGET(id).pipe(
      map(dList =>{
              const selectList: { id: any, name: string }[] = [];
              dList.list.forEach(
                drug => {
                  selectList.push(drug);
                }
              );
              return selectList;
      })
    )
  }

  getBagWares(id) {
    return this.api.getWaresFromBagUsingGET(id).pipe(
      map(wList => {
        const selectList: { id: any, name: string }[] = [];
        wList.list.forEach(
          ware => {
            selectList.push(ware);
          }
        );
        return selectList;
      })
    )
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

  // getBag(id) {
  //   return this.api.getTmpBagUsingGET(id);
  // }

  printReport(type: string) {
    switch (type) {
      case 'f110': {
        window.open(this.apiUrl + `/api/reports/callCard?id=${this.cardItem.id}`);
        break;
      }
      case 'carrySheet': {
        window.open(this.apiUrl + `/api/reports/carrySheet?id=${this.cardItem.id}`);
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


  validateCardInfo(status: Status) {
    if (status === Status.VERIFYING || status === Status.ARCHIVED){
      let checkDoc = true; // у всех доков должны быть проставлены типы
      if (this.cardItem && this.cardItem.patientFK &&  this.cardItem.patientFK.documentList){
        this.cardItem.patientFK.documentList.forEach(
          doc => {
            if (!doc.typeFK){
              checkDoc = false
            }
          }
        );
      }
      return(
        this.cardItem &&
        this.cardItem.patientFK &&
        this.cardItem.patientFK.patientTypeFK &&
        this.cardItem.patientFK.birthday && this.checkBirthDay(this.cardItem.patientFK.birthday) &&
        this.cardItem.patientFK.gender !== null &&
        this.cardItem.patientFK.name && this.cardItem.patientFK.surname &&
        this.cardItem.resultTypeFK &&
        this.cardItem.cardResultBean.mainDiagnosisFK &&
        this.cardItem.cardResultBean.complicationHelpFK &&
          checkDoc
      );
    } else {
      return true;
    }

  }

  checkBirthDay(bDay: Date) {
    let today = new Date();
    return  (today.getFullYear() - bDay.getFullYear()) < 120 && (bDay < today)
    ;
  }

  sendCardStatus(status: Status) {
    this.api.updateCardStatusUsingPOST(this.cardItem.id, status).subscribe(
      status => {
        this.cardItem.cardStatus = status;
        this.cardItemSub.next(this.cardItem);
        this.ns.success('Статус карты обновлен');
      },
      error => {
        this.ns.error('Ошибка обновления статуса');
      }
    );
  }

}


