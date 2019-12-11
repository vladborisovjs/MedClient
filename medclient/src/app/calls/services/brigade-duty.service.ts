import {Injectable} from '@angular/core';
import {MedApi, RecordType,} from '../../../../swagger/med-api.service';
import {UserService} from '../../services/user.service';
import {LogService} from "../../shared/logs/log.service";

@Injectable({
  providedIn: 'root'
})
export class BrigadeDutyService {


  constructor(private api: MedApi,  private user: UserService, private logS: LogService) { }

  // получения списков смен бригад
  getBrigadesOnDuty(mode: string){
    if (mode === 'ONLINE'){
      return this.api.getOnLineBrigadeScheduleMapUsingGET(this.user.mePerformer.performer.subdivisionFK.id);
    }else if(mode === 'OFFLINE') {
      return this.api.getNotOnLineBrigadeScheduleMapUsingGET(this.user.mePerformer.performer.subdivisionFK.id);
    }
    return this.api.getSoonBrigadeScheduleMapUsingGET(false, this.user.mePerformer.performer.subdivisionFK.id);
  }

  getBrigadeCalls(briId){
    return {
      get: (filter, offset, count) =>{
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



  // занятость смены бригады (список вызовов c начала смены)
  getBrigadeLogs(briId, dutyFrom){
    return this.logS.getLogSource(briId, RecordType.BRIGADE);
  }

  // получение состава бригады

  getBriCrew(briId){
    return this.api.getActualBrigadeCrewUsingGET(briId);
  }

  // уход бригады с линии (окончание смены)
  endDuty(briScheduleId){
    return this.api.resetBrigadeFromLineUsingPOST(briScheduleId)
  }

  // вывод бригады на линию (начало смены)
  startDuty(briScheduleId){
    return this.api.setBrigadeOnLineUsingPOST(briScheduleId)
  }


  brigadeAlarm(briId){
    return this.api.setAlarmUsingPOST(briId, 1, 1);
  }

  brigadeOnBase(briId){
   return this.api.setOnBaseUsingPOST(briId);
  }

  brigadeReturningOnBase(briId) {
    return this.api.setReturningUsingPOST(briId);
  }

  brigadeIsNotReady(briId, statusCode) {
    return this.api.setInactiveUsingPOST(briId, statusCode);
  }
}
