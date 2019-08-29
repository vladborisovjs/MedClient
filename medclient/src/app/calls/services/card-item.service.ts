import {Injectable} from '@angular/core';
import {
  CardAnamnesisPartDto, CardBasicDatesPartDto, CardBean, CardGeneralPartDto,
  CardObjectivePartDto,
  CardPatientPartDto, CardResultBean,
  CardResultDto,
  CardSideOneDto,
  CardSideTwoDto, Inventory,
  MedApi, TherapyDto, TherapyItemDto
} from '../../../../swagger/med-api.service';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {UserService} from '../../services/user.service';
import {tap} from 'rxjs/operators';
import {NotificationsService} from 'angular2-notifications';

@Injectable({
  providedIn: 'root'
})
export class CardItemService {
  cardItemSub: BehaviorSubject<CardBean>;
  cardItem: CardBean;
  formPatient: boolean;
  formObjectives: boolean;
  formResult: boolean;
  formTypeResult: boolean;
  constructor(private api: MedApi, private user: UserService, private ns: NotificationsService) {
    this.cardItemSub = new BehaviorSubject<CardBean>(null);
    this.cardItemSub.subscribe(card => this.cardItem = card);
  }

  getCard(cardId) {
    return this.api.getCardUsingGET(cardId).pipe(tap(
      card => {
        console.log('card loaded', card);
        card.cardResultBean = card.cardResultBean ? card.cardResultBean : CardResultBean.fromJS({})
        this.cardItemSub.next(card);
      }
      )
    );
  }

  saveCard() {
      console.log('--->', this.cardItem);
      this.cardItem = CardBean.fromJS(this.cardItem);
      console.log('2--->', this.cardItem);
      this.cardItem.cardResultBean ? this.cardItem.cardResultBean.id = this.cardItem.id : true;
      this.api.updateCallUsingPOST_1(this.cardItem).subscribe(
        card => {
          this.cardItemSub.next(card);
          console.log('<---', this.cardItem);
          this.ns.success('Успешно', 'Карта сохранена');
        }
      );
  }

  assignCard() {
    this.cardItemSub.next(this.cardItem);
  }

  getCartSideOne(cardId): Observable<CardSideOneDto> {
    return this.api.readSideOneUsingGET(cardId);
  }

  getCartSideTwo(cardId): Observable<CardSideTwoDto> {
    return this.api.readSideTwoUsingGET(cardId);
  }

  getPatient(cardId): Observable<CardPatientPartDto> {
    return this.api.readSideOnePatientPartUsingGET(cardId);
  }

  getGeneral(cardId): Observable<CardGeneralPartDto> {
    return this.api.readSideOneGeneralPartUsingGET_1(cardId);
  }

  getAnamnesis(cardId): Observable<CardAnamnesisPartDto> {
    return this.api.readSideTwoAnamnesisUsingGET(cardId);
  }

  getTherapy(cardId): Observable<TherapyDto> {
    return this.api.readOneUsingGET_38(cardId);
  }

  saveAnamnesis(cardId, anam): Observable<CardAnamnesisPartDto> {
    return this.api.updateAnamnesisUsingPUT(cardId, anam);
  }

  getProtocol(cardId) {
    return this.api.readProtocolUsingGET_1(cardId);
  }

  getResult(cardId) {
    return this.api.readCardResultUsingGET(cardId);
  }

  getInventories(cardId) {
    return this.api.readAllШnventoryUsingGET(cardId);
  }

  saveResult(cardId, result): Observable<CardResultDto> {
    return this.api.updateResultUsingPUT(cardId, result);
  }

  saveEditCardPatient(cardId, cardPatient) {
    cardPatient = CardPatientPartDto.fromJS(cardPatient);
    return this.api.updatePatientPartUsingPUT(cardId, cardPatient);
  }

  saveObjective(cardId, objective): Observable<CardObjectivePartDto> {
    return this.api.updateCardObjectiveUsingPUT(cardId, objective);
  }

  saveTherapy(therapy): Observable<TherapyDto> {
    therapy = TherapyDto.fromJS(therapy);
    return this.api.createUsingPOST_31(therapy);
  }

  editTherapy(id, therapy): Observable<TherapyDto> {
    therapy = TherapyDto.fromJS(therapy);
    return this.api.updateUsingPUT_32(id, therapy);
  }

  deleteTherapy(id) {
    return this.api.deleteUsingDELETE_3(id);
  }

  saveIventories(inventories): Observable<TherapyItemDto> {
    inventories = TherapyItemDto.fromJS(inventories);
    return this.api.createUsingPOST_31(inventories);
  }

  getLocalTransportAssistance(resultId, isLocal) {
    // return this.api.readAllUsingGET_40(resultId, isLocal);
    return of([]);
  }

  saveRequestCheck() {
    return this.api.readAllUsingPOST_1(this.user.subdivisionId);
  }

  updateChronology(cardId, chronology): Observable<CardBasicDatesPartDto> {
    chronology = CardBasicDatesPartDto.fromJS(chronology);
    return this.api.updateBasicDatesUsingPUT(cardId, chronology);
  }
}


