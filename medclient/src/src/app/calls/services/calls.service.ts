import {EventEmitter, Injectable} from '@angular/core';
import {CallContainer, CallStatusList, MedApi} from '../../../../swagger/med-api.service';
import {UserService} from '../../services/user.service';
import {map} from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class CallsService {
  mode = 'original';
  changeFiltering;

  constructor(protected api: MedApi, private user: UserService) {
    this.changeFiltering = new EventEmitter();
  }

  filterSubdivisionId: number; // для фильтрации бригад по району // todo: перенести сюда фильтрацию из calls-list

  getCallsList(from, count, filter) {
    console.log(filter);
    // this.filterSubdivisionId = filter.subdivisionFK.id;
    this.changeFiltering.emit(true);
    return this.api.getCallListUsingGET(
      from, count,
      filter[`orderBy`] ? filter[`orderBy`] : undefined,
      filter.isAsc,
      filter.statuses,
      undefined,
      undefined,
      undefined,
      undefined,
      filter.brigadeId,
      undefined,
      undefined,
      undefined,
      undefined,
      filter.subdivisionFK ? filter.subdivisionFK.id : undefined,
      true
    );
  }

  // getSubdivisions(subId) {
  //   return this.api.getFullSubdivisionNodeUsingGET(subId, false);
  // }
  //
  //
  // getCall(callId) {
  //   return this.api.getCallContainerUsingGET(callId);
  // }

  getActiveCardsList(from, count, filter) {
    return this.api.getCardListUsingGET(
      from,
      count,
      'date',
      false,
      undefined,
      undefined,
      undefined,
      filter.brigadeId,
      filter.subdivisionFK && filter.subdivisionFK.id
    );
  }

  getRepeatedCalls(from, count, filter) {
    return this.api.getCallListUsingGET_1(
      filter.name ? filter.name : '',
      filter.surname ? filter.surname : '',
      filter.patronymic ? filter.patronymic : '',
      from, count,
      filter.orderBy ? filter.orderBy : 'date', filter.isAsc
    );
  }

  createCall(callItem: CallContainer) {
    // callItem.call.isEmergency = this.mode === 'tcmk';
    // если вызов создается из модуля ТЦМК то ему выставляется признак ЧС // обновление "признак чс"
    callItem.call.isDeleted = false;
    callItem.call.priority = this.mode === 'tcmk' ? 1 : callItem.call.priority;
    callItem = CallContainer.fromJS(callItem);
    return this.api.updateCallContainerUsingPOST(callItem);
  }

  getCallCardsList(callId) {
    return this.api.getCardListUsingGET(0, 100, undefined, undefined, undefined, callId);
  }

  countCalls(subId) {
    return this.api.getCallCountByStatusListUsingGET(subId, true);
  }
}
