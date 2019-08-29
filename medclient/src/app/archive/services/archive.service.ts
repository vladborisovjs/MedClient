import {Injectable} from '@angular/core';
import {MedApi, Mode3} from '../../../../swagger/med-api.service';
import {UserService} from '../../services/user.service';


@Injectable({
  providedIn: 'root'
})
export class ArchiveService {

  constructor(private api: MedApi, private user: UserService) {
  }

  searchCall(from, count, filter, dateFrom, dateTo) {
    //console.log('filk', filters);

    return this.api.getCallListUsingGET(
      from, count, 'date', false,
      undefined, undefined,
      filter.number ? filter.number : undefined,
      filter.declarantName ? filter.declarantName : undefined,
      filter.reason ? filter.reason : undefined,
      undefined, dateFrom, dateTo);
  }

  searchCard(from, count) {
    return this.api.getCardListUsingGET(from, count, 'date', false);
  }

  searchPatient(from, count, filter){
    return this.api.getPatientListUsingGET(
      from,
      count,
      false,
      filter.patientType ? filter.patientType : undefined,
      filter.surname ? filter.surname : undefined );
  }
}
