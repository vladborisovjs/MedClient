import {Injectable} from '@angular/core';
import {BrigadeScheduleCreateDto, BrigadeScheduleUpdateDto, MedApi, PerformerScheduleDto2} from '../../../../swagger/med-api.service';
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
    return this.api.readPerformersCalendarUsingGET_1(this.user.subdivisionId, from, to, this.user.subdivisionId);
  }

  // получение графика работы бригад
  getCalendarScheduleBrigades(from, to) {
    return this.api.readPerformersCalendarUsingGET(this.user.subdivisionId, from, to);
  }

  // добавление смены сотруднику
  createPerformerSchedule(performerId, schItem: PerformerScheduleDto2){
    return this.api.createPerformerScheduleUsingPOST(this.user.subdivisionId, performerId, schItem)
  }

  // пролонгация рабочего графика
  prolongationGet(from, to){
    return this.api.generatePerformerScheduleCalendarUsingGET(this.user.subdivisionId, from, to)
  }

  prolongationPost(map){
    return this.api.createPerformersCalendarUsingPOST(map, this.user.subdivisionId);
  }


  // получение списка сотрудников для назначения в смену бригады
  getAvailablePerformers(from, to, gCode){
    // костыль для таймзон
    from = this.moveTimeZoneIso(from);
    to = this.moveTimeZoneIso(to);
    return this.api.readAllAvailablePerformersUsingGET(this.user.subdivisionId, from, gCode, to)
  }

  // получение списка транспорта для назначения в смену бригады
  getAvailableTranspots(from, to){
    // костыль для таймзон
    from = this.moveTimeZoneIso(from);
    to = this.moveTimeZoneIso(to);
    return this.api.readAllAvailableTranspotsUsingGET(this.user.subdivisionId, from, to)
  }

  // добавление смены бригады

  createBrigadeSchedule(briId, briItem){
    briItem = BrigadeScheduleCreateDto.fromJS(briItem);
    console.log(briItem);
    briItem.cars.forEach(
      car => {
        car.period_details.date_from = this.moveTimeZone(car.period_details.date_from);
        car.period_details.date_to = this.moveTimeZone(car.period_details.date_to);
      }
    );
    briItem.performers.forEach(
      per => {
        per.period_details.date_from = this.moveTimeZone(per.period_details.date_from);
        per.period_details.date_to = this.moveTimeZone(per.period_details.date_to);
      }
    );
    briItem.period_details.date_from = this.moveTimeZone(briItem.period_details.date_from);
    briItem.period_details.date_to = this.moveTimeZone(briItem.period_details.date_to);
    return this.api.createBrigadeScheduleUsingPOST(this.user.subdivisionId, briId, briItem)
  }

  // Редактирование смены бригады

  editBrigadeSchedule(briId, scheduleId, briItem){
    briItem = BrigadeScheduleUpdateDto.fromJS(briItem);
    return this.api.updateBrigadeScheduleUsingPUT(this.user.subdivisionId, briId, scheduleId, briItem)
  }

  // Удаление смены бригады

  deleteBrigadeSchedule(briId, scheduleId){
    return this.api.updateBrigadeScheduleUsingDELETE(this.user.subdivisionId, briId, scheduleId);
  }

  // Удаление смены сотрудника

  deletePerformerSchedule(performerId, scheduleId){
    return this.api.deletePerformersScheduleUsingDELETE(this.user.subdivisionId, performerId, scheduleId);
  }



}

