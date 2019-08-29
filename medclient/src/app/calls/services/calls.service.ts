import {Injectable} from '@angular/core';
import {CallStatusList, MedApi} from '../../../../swagger/med-api.service';
import {UserService} from '../../services/user.service';


@Injectable({
  providedIn: 'root'
})
export class CallsService {
  constructor(private api: MedApi, private user: UserService) {
  }

  getCallsList(from, count, orderBy, isAsc) {
    return this.api.getCallListUsingGET(
      from,
      count,
      orderBy ? orderBy : 'date',
      isAsc,
      [CallStatusList.UNDONE, CallStatusList.ACTIVE, CallStatusList.CONFIRM, CallStatusList.UNCONFIRM, CallStatusList.UNFOUNDED]
    );
  }

  getActiveCardsList(from, count) {
    return this.api.getCardListUsingGET(from, count, 'date', false);
  }

  getSimilarCalls(similarCall) {
    return this.api.findSimilarCallsUsingPOST(this.user.subdivisionId, similarCall);
  }

  createCall(callItem) {
    return this.api.updateCallContainerUsingPOST(callItem);
  }

  getCallCardsList(callId){
    return this.api.getCardListUsingGET(0, 100, undefined, undefined, undefined, callId);
  }
}
