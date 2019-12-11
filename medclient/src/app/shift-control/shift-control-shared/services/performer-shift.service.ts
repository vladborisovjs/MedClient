import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {MedApi, PerformerShiftBean, ScheduleTypeBean} from "../../../../../swagger/med-api.service";
import {tap} from "rxjs/operators";

export interface IShiftSubItem {
  date: {
    from: Date,
    to: Date
  }
  shifts: any[]
}

@Injectable({
  providedIn: 'root'
})
export class PerformerShiftService {
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
      pt => console.log(pt)
    );
  }

  getShifts(dateFrom, dateTo, subId = undefined) {
    this.api.getPerformerShiftTableUsingGET(false, false, dateFrom, dateTo, this.mode === 'aviation', subId).subscribe(
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

  updateShift(shift: PerformerShiftBean) {
    shift = PerformerShiftBean.fromJS(shift);
    return this.api.updatePerformerShiftUsingPOST(shift).pipe(
      tap( // обновляем таблицу смен без перезагрузки
        (res: PerformerShiftBean) => {
          console.log('shift updated', res);
          let updateRawTable = Object.assign({}, this.rawTable);

          if (shift.id) { //если смена отредактирована, то удаляем старую версию
            let rowIndex = updateRawTable.shifts.findIndex(s => s.first.id === shift.performerFK.id);
            let shiftI = updateRawTable.shifts[rowIndex].second.findIndex(s => s.id === shift.id);
            updateRawTable.shifts[rowIndex].second.splice(shiftI, 1);
          }

          updateRawTable.shifts[
            updateRawTable.shifts.findIndex(s => s.first.id === shift.performerFK.id)
            ].second.push(res);
          this.rawTableSub.next(updateRawTable);
        }
      )
    );
  }

  deleteShift(shift: PerformerShiftBean) {
    return this.api.deletePerformerShiftUsingDELETE(shift.id).pipe(
      tap( // обновляем таблицу смен без перезагрузки
        (res: PerformerShiftBean) => {
          let updateRawTable = Object.assign({}, this.rawTable);
          let rowIndex = updateRawTable.shifts.findIndex(s => s.first.id === shift.performerFK.id);
          let shiftI = updateRawTable.shifts[rowIndex].second.findIndex(s => s.id === shift.id);
          updateRawTable.shifts[rowIndex].second.splice(shiftI, 1);
          this.rawTableSub.next(updateRawTable);
        }
      )
    );
  }

  prolongation(performerIds: number[],  dateFrom, dateTo){
    return this.api.scheduleProlongationUsingPOST(performerIds, dateFrom, dateTo).pipe(
      tap(
        res => {
          console.log('prolongation success', res);
        }
      )
    );
  }

  prolongationDelete(performerIds: number[],  dateFrom, dateTo){
    return this.api.scheduleClearUsingDELETE(performerIds, dateFrom, dateTo).pipe(
      tap(
        res => {
          console.log('udolgation success', res);
        }
      )
    );
  }

  processShifts(rawShiftTable: IShiftSubItem): IShiftSubItem {
    let dayMatrix: { performer: any, days: { shifts: PerformerShiftBean[], display?: any }[] }[] = [];
    console.log(rawShiftTable);
    rawShiftTable.shifts.sort(
      (a, b) => {
        if (a.first.surname < b.first.surname) return  -1;
        if (a.first.surname > b.first.surname) return  1;
        return 0;
      }
    );
    console.log(rawShiftTable);
    for (let row in rawShiftTable.shifts) { // идем по списку пар {сотрудник, смены[]}
      dayMatrix.push(
        {
          performer: rawShiftTable.shifts[row].first,
          days: new Array(rawShiftTable.date.to.getDate() - rawShiftTable.date.from.getDate() + 1)
        }
      );
      for (let shiftI in rawShiftTable.shifts[row].second) { // идем по списку смен сотрудника
        let shift: PerformerShiftBean = PerformerShiftBean.fromJS(rawShiftTable.shifts[row].second[shiftI]);



        if (shift.dateFrom.getMonth() === rawShiftTable.date.from.getMonth()){ // если смена начинается в этот месяц (для исключения смен переходящи=х через месяц)
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
                    // if (s.dateFrom.getMonth() !== rawShiftTable.date.from.getMonth()) return; // выбрасываем смену из дургого месяца
                    sd = [
                      (
                        +(new Date(s.dateFrom.getFullYear(), s.dateFrom.getMonth(), s.dateFrom.getDate(), s.dateFrom.getHours(), s.dateFrom.getMinutes()))
                        - +(new Date(s.dateFrom.getFullYear(), s.dateFrom.getMonth(), s.dateFrom.getDate()))
                      ) * 100 / this.dayMs,
                      100
                    ];
                  } else if (s.dateTo.getDate() === dayI + 1) { // смена начинается вчера и кончается сегодня
                    // if (s.dateTo.getMonth() !== rawShiftTable.date.from.getMonth()) return; // выбрасываем смену из дургого месяца
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

    return {date: rawShiftTable.date, shifts: dayMatrix};
  }
}
