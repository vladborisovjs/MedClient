import {Injectable} from '@angular/core';
import { MedApi, CardBean, BrigadeBean, CallContainer, AviaRequestBean
} from '../../../../swagger/med-api.service';
import {UserService} from '../../services/user.service';
import {BehaviorSubject} from 'rxjs';
import {NotificationsService} from 'angular2-notifications';
import {tap} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable({providedIn: 'root'})
export class CallItemService {
  callItemSub: BehaviorSubject<CallContainer>;
  currentCall: CallContainer;
  mode: string;
  isEditingSub: BehaviorSubject<boolean>;

  constructor(protected api: MedApi, private user: UserService, private ns: NotificationsService, private router: Router) {
    this.callItemSub = new BehaviorSubject<CallContainer>(null);
    this.isEditingSub = new BehaviorSubject<boolean>(false);
    this.callItemSub.subscribe(call => this.currentCall = call);
    this.mode = 'original';
  }

  startEditing(){
    this.isEditingSub.next(true);
  }

  endEditing(){
    this.isEditingSub.next(false);
  }

  updateCall() { // обновляем вызов при его изменнии
    return this.api.getCallContainerUsingGET(this.currentCall.call.id).pipe(tap(
      call => this.callItemSub.next(call)
      )
    );
  }

  getCall(callId) {
    return this.api.getCallContainerUsingGET(callId).pipe(tap(
      call => this.callItemSub.next(call)
      )
    );
  }

  saveCall() {
    this.currentCall = CallContainer.fromJS(this.currentCall);
    // this.currentCall.call.status = null;
    return this.api.updateCallContainerUsingPOST(this.currentCall).pipe(
      tap(val => {
          this.callItemSub.next(val);
        }
      )
    );
  }

  sendAviationRequest(aR: AviaRequestBean) {
    aR = AviaRequestBean.fromJS(aR);
    return this.api.updateAviaRequestUsingPOST(aR);
  }

  findBrigadesToAppoint() {
    return this.api.getActualBrigadeCrewListUsingGET(
      undefined,
      true,
      this.user.mePerformer.performer.subdivisionFK.id === 1 ? undefined : this.user.mePerformer.performer.subdivisionFK.id, // я не хотел, меня нечай заставил
      true);
  }

  getBrigade(briId) {
    return this.api.getBrigadeUsingGET(briId);
  }

  getBrigadesCards(briId, callId) {
    return this.api.getCardListUsingGET(0, 100, undefined, true, [], callId, undefined, briId);
  }

  createCallCard(bri: BrigadeBean, callId: number) {
    return this.api.updateCardUsingPOST(CardBean.fromJS({id: 0, call: callId, brigadeFK: bri}));
  }

  getBrigadesMessages(briId, callId) {
    return this.api.getAssignedBrigadeMessageListUsingGET(briId, callId);
  }

  getMessages() {
    return this.api.getReferenceTypeListBrigadeMessageUsingGET(0, 100, false);
  }

  getReceivingTypes() {
    return this.api.getReferenceTypeListReceivingTypeUsingGET(0, 100, false);
  }

  getRejectStattuses() {
    return this.api.getBrigadeStatusListUsingGET(0, 100, false, undefined, undefined, false);
  }

  sendBrigadeMessage(briId, callId, recTypeId, mesTypeId, rejectCode) {
    return this.api.updateAssignedBrigadeMessageListUsingPOST(briId, callId, recTypeId, mesTypeId, rejectCode);
  }

  removeBrigade(callId, briId, reason){
    return this.api.deleteBrigadeFromCallUsingPOST(callId, briId, reason);
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
}
