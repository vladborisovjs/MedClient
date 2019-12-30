import { Injectable } from '@angular/core';
import {MedApi} from "../../../../../swagger/med-api.service";
import {UserService} from "../../../services/user.service";

@Injectable({
  providedIn: 'root'
})
export class UserLogsService {

  constructor(private api: MedApi,
              private user: UserService) { }

  getUserLogs(from, count, filter){

    return  this.api.getLogListByTableUsingGET(
      from,
      count,
      typeof filter.logType === "number"? filter.logType : undefined,
      typeof filter.actionType === "number" ? filter.actionType : undefined,
      filter.performerFK && filter.performerFK.id || undefined,
      (filter.subdivisionFK && filter.subdivisionFK.id) ||
      ( this.user.mePerformer.performer.subdivisionFK.id === 1 ? undefined : this.user.mePerformer.performer.subdivisionFK.id), // undefined может послать только тцмк
      false
    );
  }
}
