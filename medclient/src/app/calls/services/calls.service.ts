import {Injectable} from '@angular/core';
import {CallDtoFLAT, MedApi, Mode3} from '../../../../swagger/med-api.service';
import {UserService} from '../../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class CallsService {
  constructor(private api: MedApi, private user: UserService) {
  }

  getCallsList() {
    return this.api.readAllUsingGET_6(this.user.subdivisionId, Mode3.ACTIVE);
  }

  getCallCardsList(callId) {
    return this.api.readCardsByCallAndSubdivisionUsingGET(this.user.subdivisionId, callId, false);
  }

  getActiveCardsList() {
    return this.api.readAllUsingGET_7(Mode3.ACTIVE, this.user.subdivisionId, false);
  }

  getSimilarCalls(similarCall) {
    return this.api.findSimilarCallsUsingPOST(this.user.subdivisionId, similarCall);
  }

  createCall(callItem) {
    return this.api.createUsingPOST_5(this.user.subdivisionId, callItem);
  }
}
