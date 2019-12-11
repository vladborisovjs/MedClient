import { Injectable } from '@angular/core';
import {MedApi} from "../../../../../swagger/med-api.service";

@Injectable({
  providedIn: 'root'
})
export class UserLogsService {

  constructor(private api: MedApi) { }

  getUserLogs(from, count, filter){
    return  this.api.getLogListByTableUsingGET(from, count, filter.logType || undefined, filter.performerId || undefined );
  }
}
