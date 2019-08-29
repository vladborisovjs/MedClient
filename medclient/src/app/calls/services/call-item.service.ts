import { Injectable } from '@angular/core';
import {
  CallDto,
  CallPatientPartDto,
  CallDeclarantPartDto,
  CallFiasAddressDto,
  CallGeneralPartDto,
  FiasAddressObjectDto,
  MedApi, BrigadeAppointRequestDto, CardPatientPartDto, CallTransferDto, CardBean, BrigadeBean, CallContainer
} from '../../../../swagger/med-api.service';
import {UserService} from '../../services/user.service';
import {BehaviorSubject, Subject} from 'rxjs';
import {NotificationsService} from 'angular2-notifications';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CallItemService {
  callItemSub: BehaviorSubject<CallContainer>;
  currentCall: CallContainer;

  constructor(private api: MedApi, private user: UserService, private ns: NotificationsService) {
    this.callItemSub = new BehaviorSubject<CallContainer>(null);
    this.callItemSub.subscribe(call => this.currentCall = call);
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


  saveCall(){
    this.currentCall = CallContainer.fromJS(this.currentCall);
    this.currentCall.call.status = null;
    return this.api.updateCallContainerUsingPOST(this.currentCall).pipe(
      tap(val => {
        this.callItemSub.next(val);
        }
      )
    );
  }

  getChronology(patientId, callId) {
    return this.api.getChronicCardUsingGET(this.user.subdivisionId, callId, patientId);
  }

  getProtocol(cardId) {
    return this.api.readProtocolUsingGET_1(cardId);
  }

  getJournal(briScheduleId, callId) {
    return this.api.getBrigadeScheduleCallTransferHistoryUsingGET_1(this.user.subdivisionId, callId, briScheduleId);
  }

  getTransfer(callId) {
    return this.api.getSendListUsingGET(this.user.subdivisionId, callId);
  }

  getAvailable(callId) {
    return this.api.readAllPrimaryUsingGET(this.user.subdivisionId, callId);
  }

  getF110(callId, deleted) {
    return this.api.readCardsByCallAndSubdivisionUsingGET(this.user.subdivisionId, callId, deleted);
  }

  findBrigadesToAppoint() {
    return this.api.getActualBrigadeCrewListUsingGET(undefined, true);
  }

  appointBrigadesToCall(callId, brigades: any[]) {
    brigades.forEach(
      bri => {
        bri = BrigadeAppointRequestDto.fromJS(bri);
      }
    );
    return this.api.setBrigadeUsingPOST(this.user.subdivisionId, callId, brigades).pipe(
      tap(val => {
          this.updateCall();
        }
      )
    );
  }

  getCallsBrigades(callId) {
    return this.api.getBrigadesFromCallUsingGET(this.user.subdivisionId, callId);
  }

  saveAddress(editAddress, callId) {
    editAddress = CallFiasAddressDto.fromJS(editAddress);
    return this.api.updateAddressPartUsingPUT(this.user.subdivisionId, callId, editAddress);
  }

  getBrigadesCards(briId, callId) {
    return this.api.getCardListUsingGET(0, 100, undefined, true,[] , callId, undefined, briId);
  }

  createCallCard(bri: BrigadeBean, callId: number) {

    return  this.api.updateCallUsingPOST_1(CardBean.fromJS({id: 0,call: callId, brigadeFK: bri}))
  }

  // getCallBrigadeStatusesHistory(briScheduleId, callId) {
  //   // return this.api.getBrigadeScheduleCallTransferHistoryUsingGET_1(this.user.subdivisionId, callId, briScheduleId);
  //   return this.api.readAvailableEventsUsingGET(this.user.subdivisionId, callId, briScheduleId);
  // }

  getBrigadesMessages(briId, callId){
    return this.api.getAssignedBrigadeMessageListUsingGET(briId, callId);
  }

  getMessages(){
    return this.api.getReferenceTypeListBrigadeMessageUsingGET(0, 100, false);
  }

  getReceivingTypes(){
    return this.api.getReferenceTypeListReceivingTypeUsingGET(0, 100, false);
  }

  getRejectStattuses(){
    return this.api.getBrigadeStatusListUsingGET(0, 100, false, undefined, undefined, false);
  }

  sendBrigadeMessage(briId, callId, recTypeId, mesTypeId, rejectCode){
    return this.api.updateAssignedBrigadeMessageListUsingPOST(briId, callId, recTypeId, mesTypeId, rejectCode);
  }

  saveCallBrigadeStatusesHistory(briScheduleId, callId, sList) {
    return this.api.createNewMessageUsingPOST(this.user.subdivisionId, callId, briScheduleId, sList);
  }

  postTransfer(callId, transfers) {
    return this.api.getSubdivisionsForCallTransferUsingPOST(this.user.subdivisionId, callId, transfers);
  }

}
