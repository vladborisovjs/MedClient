import { Injectable } from '@angular/core';
import {
  CallDto,
  CallPatientPartDto,
  CallDeclarantPartDto,
  CallFiasAddressDto,
  CallGeneralPartDto,
  FiasAddressObjectDto,
  MedApi, BrigadeAppointRequestDto, CardPatientPartDto
} from '../../../../swagger/med-api.service';
import {UserService} from '../../services/user.service';
import {Subject} from 'rxjs';
import {NotificationsService} from 'angular2-notifications';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CallItemService {
  callItemSub: Subject<CallDto>;

  constructor(private api: MedApi, private user: UserService, private ns: NotificationsService) {
    this.callItemSub = new Subject<CallDto>();
  }

  updateCall(callId) { // обновляем вызов при его изменнии
    this.api.readOneUsingGET_5(this.user.subdivisionId, callId).subscribe(
      call => this.callItemSub.next(call),
      err => this.ns.error('Ошибка', 'Не удалось получить данные о вызове')
    );
  }

  getCall(callId) {
    return this.api.readOneUsingGET_5(this.user.subdivisionId, callId);
  }

  saveCallGeneral(callGeneral) {
    callGeneral = CallGeneralPartDto.fromJS(callGeneral);
    return this.api.updateGeneralPartUsingPUT(this.user.subdivisionId, callGeneral.call_id, callGeneral).pipe(
      tap(val => {
          this.updateCall(callGeneral.call_id);
        }
      )
    );
  }

  savePatient(patient, callId) {
    patient = CallPatientPartDto.fromJS(patient);
    return this.api.updateUsingPUT_5(this.user.subdivisionId, callId, patient.patient_id, patient).pipe(
      tap(val => {
          this.updateCall(callId);
        }
      )
    );
  }

  addPatients(patients: any[], callId) {
    patients.forEach(
      patient => {
        patient = CallPatientPartDto.fromJS(patient);
      }
    );
    return this.api.updatePatientsUsingPOST(this.user.subdivisionId, callId, patients).pipe(
      tap(val => {
          this.updateCall(callId);
        }
      )
    );
  }

  deletePatient(patientId, callId) {
    return this.api.deletePatientUsingDELETE(this.user.subdivisionId, callId, patientId).pipe(
      tap(val => {
          this.updateCall(callId);
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

  getF110() {
    return this.api.readAllUsingGET_7();
  }

  findBrigadesToAppoint(callId, radius = 0) {
    return this.api.findBrigadesUsingGET(this.user.subdivisionId, callId, radius);
  }

  appointBrigadesToCall(callId, brigades: any[]) {
    brigades.forEach(
      bri => {
        bri = BrigadeAppointRequestDto.fromJS(bri);
      }
    );
    return this.api.setBrigadeUsingPOST(this.user.subdivisionId, callId, brigades).pipe(
      tap(val => {
          this.updateCall(callId);
        }
      )
    );
  }

  getCallsBrigades(callId) {
    return this.api.getBrigadesFromCallUsingGET(this.user.subdivisionId, callId);
  }

  saveDeclarant(editDeclarant, callId) {
    editDeclarant = CallDeclarantPartDto.fromJS(editDeclarant);
    return this.api.updateDeclarantPartUsingPUT(this.user.subdivisionId, callId, editDeclarant).pipe(
      tap(val => {
          this.updateCall(callId);
        }
      )
    );
  }

  saveAddress(editAddress, callId) {
    editAddress = CallFiasAddressDto.fromJS(editAddress);
    return this.api.updateAddressPartUsingPUT(this.user.subdivisionId, callId, editAddress);
  }

  getBrigadesCards(briScheduleId, callId) {
    return this.api.readCardsByCallAndBrigadeUsingGET(this.user.subdivisionId, callId, briScheduleId);
  }

  createCallCard(briScheduleId, callId) {
    return this.api.createCardUsingPOST(this.user.subdivisionId, callId, briScheduleId);
  }

}
