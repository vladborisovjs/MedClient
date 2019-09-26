import {Injectable} from '@angular/core';
import {CardBean, CardResultBean, MedApi, PatientTemplateBean} from '../../../../swagger/med-api.service';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {UserService} from '../../services/user.service';
import {map, tap} from 'rxjs/operators';
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
    console.log(this.cardItem);
  }

  getCard(cardId) {
    return this.api.getCardUsingGET(cardId).pipe(tap(
      card => {
        console.log('card loaded', card);
        card.cardResultBean = card.cardResultBean ? card.cardResultBean : CardResultBean.fromJS({});
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
    this.api.updateCardUsingPOST(this.cardItem).subscribe(
      card => {
        this.cardItemSub.next(card);
        console.log('<---', this.cardItem);
        this.ns.success('Успешно', 'Карта сохранена');
      }
    );
  }

  getBagDrugs() {
    return this.api.getUniqueDrugsForBrigadeUsingGET(this.cardItem.brigadeFK.id).pipe(
      map(bList => {
          let selectList: { id: any, name: string }[] = [];
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

  getSimularPatients(patient: PatientTemplateBean) {
    this.api.getSimilarPatientListUsingGET(
      0,
      100,
      patient.name ? patient.name: undefined,
      patient.surname ? patient.surname : undefined,
      patient.patronymic ? patient.patronymic : undefined,
      patient.ageYears ? patient.ageYears : undefined,
      patient.ageMonths ? patient.ageMonths : undefined,
      patient.ageDays ? patient.ageDays : undefined,
    ).subscribe(
      patients => {
        console.log(patients);
      }
    );
  }
}


