import {Injectable} from '@angular/core';
import {CallsService} from '../../calls/services/calls.service';
import {CallStatusList, MedApi} from '../../../../swagger/med-api.service';
import {UserService} from '../../services/user.service';

@Injectable()
export class AviationCallsService extends CallsService {
  mode = 'aviation';

  constructor(api: MedApi, user: UserService) {
    super(api, user);
    console.log('aviation call item service', this.mode)
  }

  getCallsList(from, count, orderBy, isAsc, brigadeId) {
    return this.api.getCallListUsingGET(
      from, count,
      orderBy ? orderBy : 'date', isAsc,
      [CallStatusList.UNDONE, CallStatusList.ACTIVE, CallStatusList.CONFIRM, CallStatusList.UNCONFIRM, CallStatusList.UNFOUNDED],
      undefined, undefined, undefined, undefined,
      brigadeId, undefined, undefined, true
    );
  }


}
