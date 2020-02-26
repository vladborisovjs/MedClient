import {Component, OnInit} from '@angular/core';
import {IShiftSubItem} from "../../services/performer-shift.service";
import {FormControl, FormGroup} from "@angular/forms";
import {BrigadeShiftService} from "../../services/brigade-shift.service";
import {DomSanitizer} from "@angular/platform-browser";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NotificationsService} from "angular2-notifications";
import {CustomModalService} from "../../../../shared/modal/services/custom-modal.service";
import {ModalBrigadeShiftListComponent} from "../modal-brigade-shift-list/modal-brigade-shift-list.component";
import {BrigadeBean, BrigadeScheduleBean, PerformerShiftBean} from "../../../../../../swagger/med-api.service";
import {ModalBrigadeUpdateShiftComponent} from "../modal-brigade-update-shift/modal-brigade-update-shift.component";
import {ISimpleDescription} from "../../../../shared/simple-control/services/simple-description.service";
import {RoleAccessService} from "../../../../services/role-access.service";
import {IReport, reportsList} from '../../../../reports/models/report-models';
import {ModalReportOptionsComponent} from '../../../../reports/components/modal-report-options/modal-report-options.component';
import {ReportService} from '../../../../reports/services/report.service';
import {UserService} from "../../../../services/user.service";
import {IPageInfo} from "ngx-virtual-scroller";

@Component({
  selector: 'app-shift-table-brigade',
  templateUrl: './shift-table-brigade.component.html',
  styleUrls: ['./shift-table-brigade.component.scss']
})
export class ShiftTableBrigadeComponent implements OnInit {
  shiftTable: IShiftSubItem;
  headerDays: number[] = []; // заголовок дней
  months = [
    {name: 'Январь', id: 0,},
    {name: 'Февраль', id: 1},
    {name: 'Март', id: 2},
    {name: 'Апрель', id: 3},
    {name: 'Май', id: 4},
    {name: 'Июнь', id: 5},
    {name: 'Июль', id: 6,},
    {name: 'Август', id: 7},
    {name: 'Сентябрь', id: 8},
    {name: 'Октябрь', id: 9},
    {name: 'Ноябрь', id: 10},
    {name: 'Декабрь', id: 11},
  ];
  filterDescriptions: ISimpleDescription[] = [
    {
      placeholder: 'Месяц',
      key: 'month',
      type: 'select',
      selectList: this.months,
      styleClass: 'line-form col-2'
    },
    {
      placeholder: 'Год',
      key: 'year',
      type: 'number',
      styleClass: 'line-form col-2'
    },
    {
      placeholder: 'Район',
      key: 'subdivisionFK',
      type: 'dict',
      dict: 'getDistrictListUsingGET',
      bindLabel: 'shortName',
      shortDict: true,
      dictFilters: {rootId: [this.user.mePerformer.performer.subdivisionFK.id]},
      dictFiltersOrder: ['rootId'],
      styleClass: 'line-form col-4'
    }
  ];
  currentPeriod: { month: number, year: number, subdivisionFK: any }; // отображаемый месяц расписания
  form = new FormGroup({
    month: new FormControl(new Date().getMonth()),
    year: new FormControl(new Date().getFullYear()),
    subdivisionFK: new FormControl(this.user.mePerformer.performer.subdivisionFK),
  });
  vScrollPageInfo: IPageInfo;

  constructor(public bss: BrigadeShiftService,
              private sanitizer: DomSanitizer,
              private modal: NgbModal,
              private rs: ReportService,
              private ns: NotificationsService,
              public access: RoleAccessService,
              private user: UserService,
              private cmodal: CustomModalService,) {
  }

  ngOnInit() {
    this.form.valueChanges.subscribe(ch => this.setPeriod(ch));
    this.setPeriod(this.form.getRawValue());
    this.bss.shiftTableSub.subscribe(st => this.shiftTable = st);
  }

  setPeriod(period: { month: number, year: number, subdivisionFK: any }) {
    if (period.year && period.month !==null) {
      this.currentPeriod = period;
      let from = new Date(period.year, period.month, 1);
      let to = new Date(period.year, period.month + 1, 0);
      this.headerDays = [];
      for (let i = 1; i <= to.getDate(); i++) {
        this.headerDays.push(i);
      }

      from.setDate(from.getDate() + 1); // костыль для перевода в строку
      to.setDate(to.getDate() + 1);

      this.shiftTable = null; // сброс расписания старого периода
      this.bss.getShifts(
        from.toISOString().slice(0, -14),
        to.toISOString().slice(0, -14),
        (period.subdivisionFK && period.subdivisionFK.id) || this.user.mePerformer.performer.subdivisionFK.id);
    }
  }

  makeShiftStyle(display) {
    let style = 'left: ' + display[0] + '%;' + 'width:' + (display[1] - display[0]) + '%;';
    return this.sanitizer.bypassSecurityTrustStyle(style);
  }


  openShiftList(day, brigade, index) {
    if (
      !(this.bss.mode === 'original' && this.access.checkAccessWrite({level: 'shiftControl'})) &&
      !(this.bss.mode !== 'original' && this.access.checkAccessWrite({level: 'aviationModule'}))
    ) {
      return;
    }
    if (day) {
      let shiftIds = day.shifts.map(s => s.id);
      const sw = this.modal.open(ModalBrigadeShiftListComponent);
      // sw.componentInstance.day = new Date(this.currentPeriod.year, this.currentPeriod.month, index+1);
      sw.componentInstance.shiftIds = shiftIds;
      sw.componentInstance.brigade = brigade;

      sw.result.then(
        res => {
          if (res) {
            if (res.type === 'edit') {
              this.updateShift(brigade, new Date(this.currentPeriod.year, this.currentPeriod.month, index + 1), day.shifts, res.shift);
            } else if (res.type === 'delete') {
              this.deleteShift(res.shift);
            } else if (res.type === 'new') {
              this.updateShift(brigade, new Date(this.currentPeriod.year, this.currentPeriod.month, index + 1), day.shifts);
            }
          }
        },
        () => {
        }
      );
    } else {
      this.updateShift(brigade, new Date(this.currentPeriod.year, this.currentPeriod.month, index + 1));
    }
  }

  updateShift(brigade: BrigadeBean, date: Date, existingShifts?: BrigadeScheduleBean[], editingShift?: BrigadeScheduleBean) {
    const upShift = this.modal.open(ModalBrigadeUpdateShiftComponent);
    upShift.componentInstance.brigade = brigade;
    upShift.componentInstance.date = date;
    upShift.componentInstance.existingShifts = existingShifts;
    upShift.componentInstance.subdivisionId = this.user.mePerformer.performer.subdivisionFK.id;
    if (editingShift) upShift.componentInstance.shiftItem = editingShift;
    upShift.result.then(
      res => {
        if (res) this.bss.updateShift(res).subscribe(
          ans => {
            this.ns.success('Успешно', 'Расписание обновлено');
            console.log(ans);
          },
          error => {
            this.ns.error('Ошибка', 'Не удалось обновить расписание');
          }
        );
      },
      () => {
      }
    );
  }

  deleteShift(shift: BrigadeScheduleBean) {
    this.bss.deleteShift(shift).subscribe(
      (ans) => {
        this.ns.success('Успешно', 'Расписание обновлено');
      },
      error => {
        this.ns.error('Ошибка', 'Не удалось обновить расписание');
        console.log(error);
      }
    );
    console.log('удаление смены!', shift);
  }

  printReport() {
    let report: IReport = reportsList.find(r => r.block === 'scheduleBrigade');
    if (!report) return;
    const repOpt = this.modal.open(ModalReportOptionsComponent);
    repOpt.componentInstance.report = report;
    repOpt.result.then(
      options => {
        console.log(options);
        if (options) this.rs.printReport(report, options);
      }
    );
  }

}
