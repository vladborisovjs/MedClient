import {Injectable} from '@angular/core';
import {MedApi, RecordType,} from '../../../../swagger/med-api.service';
import {UserService} from '../../services/user.service';
import {LogService} from "../../shared/logs/log.service";
import {CallsService} from "./calls.service";
import {ICallsTableFilter} from "../calls-shared/calls-container/calls-container.component";

@Injectable({
  providedIn: 'root'
})
export class BrigadeDutyService {


  constructor(private api: MedApi,
              private cs: CallsService,
              private user: UserService,
              private logS: LogService) {
  }

  // получения списков смен бригад
  getBrigadesOnDuty(mode: 'online' | 'offline' | 'upcoming', filter: ICallsTableFilter) {
    console.log(filter.subdivisionFK && filter.subdivisionFK.id);
    if (mode === 'online') {
      return this.api.getOnLineBrigadeScheduleMapUsingGET(filter.subdivisionFK ? filter.subdivisionFK.id : undefined);
    } else if (mode === 'offline') {
      return this.api.getNotOnLineBrigadeScheduleMapUsingGET(filter.subdivisionFK ? filter.subdivisionFK.id : undefined);
    }
    return this.api.getSoonBrigadeScheduleMapUsingGET(
      false,
      filter.subdivisionFK ? filter.subdivisionFK.id : undefined);
  }

  getBrigadeCalls(briId) {
    return {
      get: (filter, offset, count) => {
        return this.api.getCallListUsingGET(offset, count, undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          briId,
        )
      }
    }
  }

  getBrigadeCallsList(briId) {
    return this.api.getCallListUsingGET(0, 100, undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      briId, // todo: ограничить сменой бригады
    )
  }


  // занятость смены бригады (список вызовов c начала смены)
  getBrigadeLogs(briId, dutyFrom) {
    return this.logS.getLogSource(briId, RecordType.BRIGADE);
  }

  // получение состава бригады

  getBriCrew(briId, date: any = new Date().toISOString()) {
    return this.api.getActualBrigadeCrewUsingGET(briId, date);
  }

  // уход бригады с линии (окончание смены)
  endDuty(briScheduleId) {
    return this.api.resetBrigadeFromLineUsingPOST(briScheduleId)
  }

  // вывод бригады на линию (начало смены)
  startDuty(briScheduleId) {
    return this.api.setBrigadeOnLineUsingPOST(briScheduleId)
  }


  brigadeAlarm(briId) {
    return this.api.setAlarmUsingPOST(briId, 1, 1);
  }

  brigadeOnBase(briId) {
    return this.api.setOnBaseUsingPOST(briId);
  }

  brigadeReturningOnBase(briId) {
    return this.api.setReturningUsingPOST(briId);
  }

  brigadeIsNotReady(briId, statusCode) {
    return this.api.setInactiveUsingPOST(briId, statusCode);
  }
}
