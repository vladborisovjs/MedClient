import { Injectable } from '@angular/core';
import {AviaRequestBean, MedApi} from '../../../../swagger/med-api.service';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  constructor(private api: MedApi) { }

  getRequestList(offset, count, filter){
    return this.api.getAviaRequestListUsingGET(offset, count, filter.isAccepted, filter.isNewRequest)
  }

  updateRequest(requestItem: AviaRequestBean, accept?: boolean){
    requestItem.isAccept = accept !== undefined ? accept : requestItem.isAccept;
    requestItem = AviaRequestBean.fromJS(requestItem);
    return this.api.updateAviaRequestUsingPOST(requestItem);
  }

  getAvailablebrigades(){
    return this.api.getActualAviaBrigadeCrewListUsingGET(undefined, true)
  }
}
