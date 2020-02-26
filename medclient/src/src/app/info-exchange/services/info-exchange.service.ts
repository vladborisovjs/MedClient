import { Injectable } from '@angular/core';
import {CardResultBean, MedApi} from '../../../../swagger/med-api.service';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InfoExchangeService {
  constructor(private api: MedApi) { }

  getLogsEGISZ(offset, count, filter) {
    return this.api.getExtendedLogListByRecordUsingGET(
      offset,
      count,
      filter.subdivisionId ? filter.subdivisionId : undefined,
      filter.performerId ? filter.performerId : undefined,
      filter.fio ? filter.fio : undefined,
      filter.dateFrom ? filter.dateFrom.toISOString().slice(0,10) : undefined,
      filter.dateTo ? filter.dateTo.toISOString().slice(0,10) : undefined);
  }

  getLog(logId) {
    return this.api.getBodyUsingGET(logId);
  }

}
