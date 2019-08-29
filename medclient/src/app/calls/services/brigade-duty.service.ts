import { Injectable } from '@angular/core';
import {BrigadeDutyRequestDto, BrigadeStatusBean, CallStatusList, MedApi, Mode} from '../../../../swagger/med-api.service';
import {UserService} from '../../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class BrigadeDutyService {


  constructor(private api: MedApi,  private user: UserService,) { }

  // получения списков смен бригад
  getBrigadesOnDuty(mode: string){
    if (mode === 'ONLINE'){
      return this.api.getOnLineBrigadeScheduleMapUsingGET();
    }else if(mode === 'OFFLINE') {
      return this.api.getNotOnLineBrigadeScheduleMapUsingGET();
    }
    return this.api.getSoonBrigadeScheduleMapUsingGET();


    // return this.api.readAllActualUsingGET(this.user.subdivisionId, mode)
  }

  // журнал событий смены бригады
  getBrigdeProtocol(briId){
    return this.api.getBrigadeScheduleCallTransferHistoryUsingGET(this.user.subdivisionId, briId)
  }

  // занятость смены бригады (список вызовов c начала смены)
  getBrigadeDoings(briId, dutyFrom){
    return this.api.getCallListUsingGET(0,100, 'date', true, undefined,
      undefined, undefined, undefined, undefined, briId, dutyFrom);
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
}
