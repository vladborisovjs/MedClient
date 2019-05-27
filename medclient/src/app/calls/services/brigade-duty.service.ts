import { Injectable } from '@angular/core';
import {BrigadeDutyRequestDto, MedApi, Mode} from '../../../../swagger/med-api.service';
import {UserService} from '../../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class BrigadeDutyService {

  constructor(private api: MedApi,  private user: UserService,) { }

  // получения списков смен бригад
  getBrigadesOnDuty(mode: Mode){
    return this.api.readAllActualUsingGET(this.user.subdivisionId, mode)
  }

  // журнал событий смены бригады
  getBrigdeProtocol(briId){
    return this.api.getBrigadeScheduleCallTransferHistoryUsingGET(this.user.subdivisionId, briId)
  }

  // занятость смены бригады (список вызовов)
  getBrigadeDoings(briId, scheduleId){
    return this.api.getBrigadeScheduleCallsUsingGET(this.user.subdivisionId, briId, scheduleId)
  }

  // уход бригады с линии (окончание смены)
  endDuty(scheduleId, briResult: BrigadeDutyRequestDto){
    return this.api.endBrigadeDutyUsingPUT(this.user.subdivisionId, scheduleId, briResult)
  }

  // вывод бригады на линию (начало смены)
  startDuty(scheduleId, briResult: BrigadeDutyRequestDto){
    return this.api.startBrigadeDutyUsingPUT(this.user.subdivisionId, scheduleId, briResult)
  }




}
