import {Injectable} from '@angular/core';
import {MedApi} from '../../../../swagger/med-api.service';
import {of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DrugRequestService {


  constructor(private api: MedApi) {
  }

  getDrugRequestList(filter, offset, count){
    return this.api.getDrugRequestsUsingGET(offset, count, undefined, filter.accepted);
  }

  rechargeBag(requestId){
    return this.api.rechargeBagUsingPOST(requestId);
  }

  deleteRequest(requestId){
    return this.api.deleteDrugRequestUsingDELETE(requestId);
  }

  getMovementsList(offset, count, filter){
    return this.api.getDrugOperationListUsingGET(offset, count, false);
  }

}
