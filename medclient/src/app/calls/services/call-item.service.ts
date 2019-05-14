import { Injectable } from '@angular/core';
import {
  CallDto,
  CallPatientPartDto,
  CallDeclarantPartDto,
  CallFiasAddressDto,
  CallGeneralPartDto,
  FiasAddressObjectDto,
  MedApi
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


  saveDeclarant(editDeclarant) {
    editDeclarant = CallDeclarantPartDto.fromJS(editDeclarant);
    return this.api.updateDeclarantPartUsingPUT(this.user.subdivisionId, 408346, editDeclarant);
  }

  saveAddress(editAddress) {
    editAddress = CallFiasAddressDto.fromJS(editAddress);
    return this.api.updateAddressPartUsingPUT(this.user.subdivisionId, 408346, editAddress);
  }

}
