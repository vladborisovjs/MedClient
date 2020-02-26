import {Injectable} from '@angular/core';
import {BehaviorSubject, zip} from "rxjs";
import {BrigadeScheduleBean, MedApi} from "../../../../../swagger/med-api.service";
import {tap} from "rxjs/operators";


interface IShiftSubItem {
  date: {
    from: Date,
    to: Date
  }
  shifts: any[]
}

@Injectable({
  providedIn: 'root'
})
export class BrigadeShiftService {
  mode = 'original';
  shiftTableSub: BehaviorSubject<IShiftSubItem> = new BehaviorSubject<IShiftSubItem>(null); // обработанная таблица
  rawTableSub: BehaviorSubject<IShiftSubItem> = new BehaviorSubject<IShiftSubItem>(null); // сырая таблица расписаний с сервера
  readonly dayMs = 86400000;
  rawTable: IShiftSubItem;

  constructor(private api: MedApi) {
    this.rawTableSub.subscribe(
      (rt: IShiftSubItem) => {
        if (rt) {
          this.shiftTableSub.next(this.processShifts(rt));
          this.rawTable = rt;
        }
      }
    );
    this.shiftTableSub.subscribe(
      // pt => console.log(pt)
    );
  }

  getShifts(dateFrom, dateTo, subId) {
    if (this.mode === 'original') {
      this.api.getBrigadeScheduleMapUsingGET(dateFrom, dateTo, false, undefined, undefined, subId).subscribe(
        rawShiftTable => this.rawTableSub.next(
          {
            date: {
              from: new Date(dateFrom),
              to: new Date(dateTo)
            },
            shifts: rawShiftTable
          }
        ),
        () => console.log('Не удалось получить таблицу расписаний!')
      );
    } else if (this.mode === 'aviation') {
      this.api.getAviaBrigadeScheduleMapUsingGET(dateFrom, dateTo, false, undefined).subscribe(
        rawShiftTable => this.rawTableSub.next(
          {
            date: {
              from: new Date(dateFrom),
              to: new Date(dateTo)
            },
            shifts: rawShiftTable
          }
        ),
        () => console.log('Не удалось получить таблицу расписаний!')
      );
    }

  }

  // getShiftsInDay(brigadeId, day: Date){
  //   let dayEnd = new Date(day);
  //   dayEnd.setHours(23);
  //   dayEnd.setMinutes(59);
  //   dayEnd.setSeconds(59);
  //   return this.api.getBrigadeScheduleListUsingGET(brigadeId, day.toISOString(), dayEnd.toISOString());
  // }

  getAvailablePerformers(dateFrom, dateTo, type, subdivisionId?) {
    dateTo = dateTo.toISOString();
    dateFrom = dateFrom.toISOString();
    return this.api.getAvailablePerformersUsingGET(dateFrom, dateTo, type, subdivisionId || undefined)
  }

  getAvailableTransport(dateFrom, dateTo, subdivisionId?) {
    dateTo = dateTo.toISOString();
    dateFrom = dateFrom.toISOString();
    if (this.mode === 'original') {
      return this.api.getAvailableTransportsUsingGET(dateFrom, dateTo, subdivisionId || undefined);
    } else if (this.mode === 'aviation') {
      return this.api.getAvailableHelicoptersUsingGET(dateFrom, dateTo);
    }
  }

  updateShift(shift: BrigadeScheduleBean) {
    shift = BrigadeScheduleBean.fromJS(shift);

    return this.api.updateBrigadeScheduleUsingPOST(shift).pipe(
      tap(
        res => {
          // console.log('shift updated', res);
          let updateRawTable = Object.assign({}, this.rawTable);

          if (shift.id) { //если смена отредактирована, то удаляем старую версию
            let rowIndex = updateRawTable.shifts.findIndex(s => s.first.id === shift.brigade);
            let shiftI = updateRawTable.shifts[rowIndex].second.findIndex(s => s.id === shift.id);
            updateRawTable.shifts[rowIndex].second.splice(shiftI, 1);
          }

          updateRawTable.shifts[
            updateRawTable.shifts.findIndex(s => s.first.id === shift.brigade)
            ].second.push(res);
          this.rawTableSub.next(updateRawTable);
        }
      )
    );
  }

  deleteShift(shift: BrigadeScheduleBean) {
    return this.api.deleteBrigadeScheduleUsingDELETE(shift.id).pipe(
      tap( // обновляем таблицу смен без перезагрузки
        (res: BrigadeScheduleBean) => {
          let updateRawTable = Object.assign({}, this.rawTable);
          let rowIndex = updateRawTable.shifts.findIndex(s => s.first.id === shift.brigade);
          let shiftI = updateRawTable.shifts[rowIndex].second.findIndex(s => s.id === shift.id);
          updateRawTable.shifts[rowIndex].second.splice(shiftI, 1);
          this.rawTableSub.next(updateRawTable);
        }
      )
    );
  }

  getShiftList(ids: number[]) {
    let requests = [];
    ids.forEach(id => requests.push(this.api.getBrigadeScheduleUsingGET(id)));
    return zip(...requests);
  }

  processShifts(rawShiftTable: IShiftSubItem): IShiftSubItem {
    // console.log(rawShiftTable);
    let dayMatrix: { brigade: any, days: { shifts: BrigadeScheduleBean[], display?: any }[] }[] = [];

    for (let row in rawShiftTable.shifts) { // идем по списку пар {сотрудник, смены[]}
      dayMatrix.push(
        {
          brigade: rawShiftTable.shifts[row].first,
          days: new Array(rawShiftTable.date.to.getDate() - rawShiftTable.date.from.getDate() + 1)
        }
      );
      for (let shiftI in rawShiftTable.shifts[row].second) { // идем по списку смен сотрудника
        let shift: BrigadeScheduleBean = BrigadeScheduleBean.fromJS(rawShiftTable.shifts[row].second[shiftI]);


        if (shift.dateFrom.getMonth() === rawShiftTable.date.from.getMonth()) { // если смена начинается в этот месяц (для исключения смен переходящи=х через месяц)
          if (dayMatrix[row].days[shift.dateFrom.getDate() - 1]) { // если в дне уже есть смены
            dayMatrix[row].days[shift.dateFrom.getDate() - 1].shifts.push(shift);
          } else { // в этом дне еще нет смен
            dayMatrix[row].days[shift.dateFrom.getDate() - 1] = {shifts: [shift], display: []};
          }
        }

        if (shift.dateTo.getMonth() === rawShiftTable.date.from.getMonth()) { // если смена заканчивается в этот месяц (для исключения смен переходящи=х через месяц)
          if (shift.dateFrom.getDate() !== shift.dateTo.getDate()) { // переходящая смена
            if (dayMatrix[row].days[shift.dateTo.getDate() - 1]) { // если в дне уже есть смены
              dayMatrix[row].days[shift.dateTo.getDate() - 1].shifts.push(shift);
            } else { // в этом дне еще нет смен
              dayMatrix[row].days[shift.dateTo.getDate() - 1] = {shifts: [shift], display: []};
            }
          }
        }
      }
    }

    for (let row of dayMatrix) { // вычисление границ смены
      row.days.forEach(
        (day, dayI) => {
          if (day) {
            day.shifts.forEach(
              s => {
                let sd;
                if (s.dateFrom.getDate() === s.dateTo.getDate()) {
                  sd = [
                    (
                      +(new Date(s.dateFrom.getFullYear(), s.dateFrom.getMonth(), s.dateFrom.getDate(), s.dateFrom.getHours(), s.dateFrom.getMinutes()))
                      - +(new Date(s.dateFrom.getFullYear(), s.dateFrom.getMonth(), s.dateFrom.getDate()))
                    ) * 100 / this.dayMs,
                    (
                      +(new Date(s.dateTo.getFullYear(), s.dateTo.getMonth(), s.dateTo.getDate(), s.dateTo.getHours(), s.dateTo.getMinutes()))
                      - +(new Date(s.dateTo.getFullYear(), s.dateTo.getMonth(), s.dateTo.getDate()))
                    ) * 100 / this.dayMs
                  ];
                } else { // если смена переходящая
                  if (s.dateFrom.getDate() === dayI + 1) { // смена начинается сегодня и кончается завтра
                    sd = [
                      (
                        +(new Date(s.dateFrom.getFullYear(), s.dateFrom.getMonth(), s.dateFrom.getDate(), s.dateFrom.getHours(), s.dateFrom.getMinutes()))
                        - +(new Date(s.dateFrom.getFullYear(), s.dateFrom.getMonth(), s.dateFrom.getDate()))
                      ) * 100 / this.dayMs,
                      100
                    ];
                  } else if (s.dateTo.getDate() === dayI + 1) { // смена начинается вчера и кончается сегодня
                    sd = [
                      0,
                      (
                        +(new Date(s.dateTo.getFullYear(), s.dateTo.getMonth(), s.dateTo.getDate(), s.dateTo.getHours(), s.dateTo.getMinutes()))
                        - +(new Date(s.dateTo.getFullYear(), s.dateTo.getMonth(), s.dateTo.getDate()))
                      ) * 100 / this.dayMs
                    ];
                  }
                }
                day.display.push(sd);
              }
            );
          }

        }
      );

    }
    // console.log(dayMatrix);
    return {date: rawShiftTable.date, shifts: dayMatrix};
  }
}
