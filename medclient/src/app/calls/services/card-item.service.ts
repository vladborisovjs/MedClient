import { Injectable } from '@angular/core';
import {
  CardAnamnesisPartDto,
  CardObjectivePartDto,
  CardPatientPartDto,
  CardResultDto,
  CardSideOneDto,
  CardSideTwoDto, Inventory,
  MedApi, TherapyDto, TherapyItemDto
} from '../../../../swagger/med-api.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardItemService {

  constructor(private api: MedApi) { }

  getCartSideOne(cardId): Observable<CardSideOneDto> {
    return this.api.readSideOneUsingGET(cardId);
  }

  getCartSideTwo(cardId): Observable<CardSideTwoDto> {
    return this.api.readSideTwoUsingGET(cardId);
  }

  getPatient(cardId): Observable<CardPatientPartDto> {
    return this.api.readSideOnePatientPartUsingGET(cardId);
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

  deleteTherapy(therapy) {
    therapy = TherapyDto.fromJS(therapy);
    return this.api.deleteUsingDELETE_3(therapy);
  }

  saveIventories(inventories): Observable<TherapyItemDto> {
    inventories = TherapyItemDto.fromJS(inventories);
    return this.api.createUsingPOST_31(inventories);
  }
}
