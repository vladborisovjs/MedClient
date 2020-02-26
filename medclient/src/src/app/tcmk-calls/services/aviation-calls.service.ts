import {Injectable} from '@angular/core';
import {CallsService} from '../../calls/services/calls.service';
import {CallStatusList, MedApi} from '../../../../swagger/med-api.service';
import {UserService} from '../../services/user.service';

@Injectable()
export class AviationCallsService extends CallsService {
  mode = 'tcmk';

  constructor(api: MedApi, user: UserService) {
    super(api, user);
  }

  getCallsList(from, count, filter) {
    return this.api.getTcmkCallListUsingGET(
      from, count,
      filter[`orderBy`] ? filter[`orderBy`] : undefined, filter.isAsc,
      filter.statuses,
      undefined,
      undefined,
      filter.subdivisionFK ? filter.subdivisionFK.id : undefined,
      true,
    );

  }

  countCalls(subId) {
    return this.api.getTcmkCallCountByStatusListUsingGET(subId, true);
  }
}
