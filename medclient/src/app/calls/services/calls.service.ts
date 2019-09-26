import {Injectable} from '@angular/core';
import {CallContainer, CallStatusList, MedApi} from '../../../../swagger/med-api.service';
import {UserService} from '../../services/user.service';


@Injectable({providedIn: 'root'})
export class CallsService {
  mode = 'original';

  constructor(protected api: MedApi, private user: UserService) {
  }


  getCallsList(from, count, orderBy, isAsc, brigadeId) {
    return this.api.getCallListUsingGET(
      from, count,
      orderBy ? orderBy : 'date', isAsc,
      [CallStatusList.UNDONE, CallStatusList.ACTIVE, CallStatusList.CONFIRM, CallStatusList.UNCONFIRM, CallStatusList.UNFOUNDED],
      undefined, undefined, undefined, undefined,
      brigadeId
    );
  }

  getCall(callId) {
    return this.api.getCallContainerUsingGET(callId);
  }
  getActiveCardsList(from, count, brigadeId) {
    return this.api.getCardListUsingGET(
      from, count,
      'date', false,
      undefined, undefined, undefined,
      brigadeId
    );
  }

  getRepeatedCalls(from, count, orderBy, isAsc, patientName, patientSurname, patientPatronymic) {
    return this.api.getCallListUsingGET_1(
      patientName ? patientName : '',
      patientSurname ? patientSurname : '',
      patientPatronymic ? patientPatronymic : '',
      from, count,
      orderBy ? orderBy : 'date', isAsc
    );
  }

  createCall(callItem: CallContainer) {
    callItem.call.isEmergency = this.mode === 'aviation'; // если вызов создается из модуля ТЦМК то ему выставляется признак ЧС
    callItem.call.isDeleted = false;
    callItem = CallContainer.fromJS(callItem);
    console.log(callItem);
    return this.api.updateCallContainerUsingPOST(callItem);
  }


  getCallCardsList(callId) {
    return this.api.getCardListUsingGET(0, 100, undefined, undefined, undefined, callId);
  }
}
