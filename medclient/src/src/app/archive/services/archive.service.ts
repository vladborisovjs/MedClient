import {Injectable} from '@angular/core';
import {
  ArchiveCardContainer,
  MedApi,
  PatientBean
} from '../../../../swagger/med-api.service';
import {UserService} from '../../services/user.service';


@Injectable({
  providedIn: 'root'
})
export class ArchiveService {
  constructor(private api: MedApi, private user: UserService) {
  }

  searchCall(bean, from, count) {
    bean.subdivisionId = bean.subdivisionId || this.user.mePerformer.performer.subdivisionFK.id; // ограничение по району
    return this.api.getArchiveCallListUsingPOST(bean,
      from, count, 'number', false);
  }

  searchCard(bean: ArchiveCardContainer, from, count) {
    bean.subdivisionId = bean.subdivisionId || this.user.mePerformer.performer.subdivisionFK.id; // ограничение по району
    return this.api.getArchiveCardListUsingPOST(bean, from, count, 'date', false);
  }

  searchPatient(from, count, filter){
    return this.api.getPatientListUsingGET(
      from,
      count,
      filter.isDeleted,
      filter.patientType ? filter.patientType : undefined,
      filter.surname ? filter.surname : undefined,
      filter.name ? filter.name : undefined,
      filter.patronymic ? filter.patronymic : undefined,
      filter.dateBirth ? filter.dateBirth : undefined);
  }

  getPatient(patId) {
    return this.api.getPatientUsingGET(patId);
  }

  getPatientCards(from, count, filter) {
    return this.api.getCardListUsingGET(
      from, count, 'date', false,
      undefined, undefined, filter.patientId ? filter.patientId : undefined, undefined
    );
  }

  savePatient(patientBean) {
    patientBean = PatientBean.fromJS(patientBean);
    return this.api.updatePatientUsingPOST(patientBean);
  }

  sendEgisz(egisz) {
    return this.api.egiszCasesUsingGET(egisz);
  }

  deleteCard(card){
    return this.api.deleteCardUsingDELETE(card.id);
  }

  restoreCard(card){
    return this.api.restoreCardUsingPOST(card.id);
  }

  deletePatient(pat){
    return this.api.deletePatientUsingDELETE(pat.id);
  }

  restorePatient(pat){
    return this.api.restorePatientUsingPOST(pat.id);
  }
}
