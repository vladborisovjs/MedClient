import { Injectable } from '@angular/core';
import {CardResultBean, MedApi} from '../../../../swagger/med-api.service';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InfoExchangeService {
  constructor(private api: MedApi) { }

  getLogsEGISZ(offset, count) {
    return this.api.getExtendedLogListByRecordUsingGET_1(offset, count);
  }

  getLog(logId) {
    return this.api.getLogByIdUsingGET(logId);
  }

}
