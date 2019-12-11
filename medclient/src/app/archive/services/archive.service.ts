import {Injectable} from '@angular/core';
import {
  ArchiveCardContainer,
  CallPriorityList,
  CallStatusList,
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
    return this.api.getArchiveCallListUsingPOST(bean,
      from, count, 'date', false);
  }

  searchCard(bean: ArchiveCardContainer, from, count) {
    return this.api.getArchiveCardListUsingPOST(bean, from, count, 'date', false);
  }

  searchPatient(from, count, filter){
    return this.api.getPatientListUsingGET(
      from,
      count,
      false,
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
}
