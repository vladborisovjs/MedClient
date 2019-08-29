import {Injectable} from '@angular/core';
import {
  BrigadeScheduleBean,
  BrigadeScheduleCreateDto,
  BrigadeScheduleUpdateDto,
  MedApi,
  PerformerScheduleDto2,
  PerformerShiftBean
} from '../../../../swagger/med-api.service';
import {UserService} from '../../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private api: MedApi, private user: UserService) {
  }

  moveTimeZoneIso(t){
    t = new Date(t);
    t.setHours(t.getHours() + 3);
    t = t.toISOString();
    return t;

  }
  moveTimeZone(t){
    t = new Date(t);
    t.setHours(t.getHours() + 3);
    return t;

  }

  // получение графика работы сотрудников
  getCalendarSchedulePerfomers(from, to) {
    return this.api.getPerformerShiftTableUsingGET(false, false, from, to);
  }

  // получение графика работы бригад
  getCalendarScheduleBrigades(from, to) {
    return this.api.getBrigadeScheduleMapUsingGET(from, to, false);
  }

  // добавление смены сотруднику
  createPerformerSchedule(schItem) {
    return this.api.updatePerformerShiftUsingPOST(schItem);
  }

  // пролонгация рабочего графика
  prolongation(ids, performanceTypeId, from, to){
    return this.api.scheduleProlongationUsingPOST(ids, performanceTypeId, from, to, undefined)
  }



  // получение списка сотрудников для назначения в смену бригады
  getAvailablePerformers(type, from, to){
    // костыль для таймзон
    // from = this.moveTimeZoneIso(from);
    // to = this.moveTimeZoneIso(to);
    return this.api.getAvailablePerformersUsingGET(from, to, type);
  }

  // получение списка транспорта для назначения в смену бригады
  getAvailableTranspots(from, to) {
    // костыль для таймзон
    // from = this.moveTimeZoneIso(from);
    // to = this.moveTimeZoneIso(to);
    return this.api.getAvailableTransportsUsingGET(from, to);
  }

  // добавление смены бригады

  createBrigadeSchedule(briItem: BrigadeScheduleBean) {
    briItem.isAvailable = false;
    // briItem = BrigadeScheduleCreateDto.fromJS(briItem);
    // console.log(briItem);
    // briItem.cars.forEach(
    //   car => {
    //     car.period_details.date_from = this.moveTimeZone(car.period_details.date_from);
    //     car.period_details.date_to = this.moveTimeZone(car.period_details.date_to);
    //   }
    // );
    // briItem.performers.forEach(
    //   per => {
    //     per.period_details.date_from = this.moveTimeZone(per.period_details.date_from);
    //     per.period_details.date_to = this.moveTimeZone(per.period_details.date_to);
    //   }
    // );
    // briItem.period_details.date_from = this.moveTimeZone(briItem.period_details.date_from);
    // briItem.period_details.date_to = this.moveTimeZone(briItem.period_details.date_to);
    return this.api.updateBrigadeScheduleUsingPOST(briItem)
  }

  // Редактирование смены бригады

  editBrigadeSchedule(briId, scheduleId, briItem){
    // briItem = BrigadeScheduleUpdateDto.fromJS(briItem);
    return this.api.updateBrigadeScheduleUsingPOST(briItem)
  }

  // Удаление смены бригады

  // deleteBrigadeSchedule(id){
  //   return this.api.deleteBrigadeScheduleUsingDELETE(id);
  // }

  // Удаление смены сотрудника
  deletePerformerSchedule(performerId){
    return this.api.deletePerformerShiftUsingDELETE(performerId);
  }

  getBrigadeScheduleById(id) {
    return this.api.getBrigadeScheduleUsingGET(id)
  }



}

