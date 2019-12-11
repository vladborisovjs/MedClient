import {Component, OnInit} from '@angular/core';
import {IShiftSubItem, PerformerShiftService} from "../../services/performer-shift.service";
import {DomSanitizer} from "@angular/platform-browser";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ModalPerformerShiftListComponent} from "../modal-performer-shift-list/modal-performer-shift-list.component";
import {CustomModalService} from "../../../../shared/modal/services/custom-modal.service";
import {FormControl, FormGroup} from "@angular/forms";
import {PerformerBean, PerformerShiftBean} from "../../../../../../swagger/med-api.service";
import {ModalPerformerUpdateShiftComponent} from "../modal-performer-update-shift/modal-performer-update-shift.component";
import {NotificationsService} from "angular2-notifications";
import {ModalPerformerProlongationComponent} from "../modal-performer-prolongation/modal-performer-prolongation.component";
import {ModalPerformerProlongationDeleteComponent} from "../modal-performer-prolongation-delete/modal-performer-prolongation-delete.component";
import {ISimpleDescription} from "../../../../shared/simple-control/services/simple-description.service";
import {RoleAccessService} from "../../../../services/role-access.service";
import {ModalReportOptionsComponent} from '../../../../reports/components/modal-report-options/modal-report-options.component';
import {IReport, reportsList} from '../../../../reports/models/report-models';
import {ReportService} from '../../../../reports/services/report.service';
import {UserService} from "../../../../services/user.service";


@Component({
  selector: 'app-shift-table',
  templateUrl: './shift-table.component.html',
  styleUrls: ['./shift-table.component.scss']
})
export class ShiftTableComponent implements OnInit {
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
      label: '',
      key: 'month',
      type: 'select',
      selectList: this.months,
      styleClass: 'line-form col-2'
    },
    {
      label: '',
      key: 'year',
      type: 'number',
      styleClass: 'line-form col-2'
    },
    // {
    //   label: '',
    //   key: 'subdivisionId',
    //   bindValue: 'id',
    //   placeholder: 'Район',
    //   dictFilters: {type: [448641]},
    //   dictFiltersOrder: ['type'],
    //   type: 'dict',
    //   dict: 'getSubdivisionListUsingGET',
    //   styleClass: 'line-form col-6'
    // }

  ];
  currentPeriod: { month: number, year: number, subdivisionId }; // отображаемый месяц расписания
  form = new FormGroup({
    month: new FormControl(new Date().getMonth()),
    year: new FormControl(new Date().getFullYear()),
    subdivisionId: new FormControl(),
  });

  prolongationActive: boolean; // флаг: если есть выбранные сотрудники для пролонгации/удолгации

  constructor(public pss: PerformerShiftService,
              private sanitizer: DomSanitizer,
              private modal: NgbModal,
              private rs: ReportService,
              private ns: NotificationsService,
              public access: RoleAccessService,
              private user: UserService,) {
  }

  ngOnInit() {
    this.form.valueChanges.subscribe(ch => this.setPeriod(ch));
    this.setPeriod(this.form.getRawValue());
    this.pss.shiftTableSub.subscribe(st => this.shiftTable = st);
  }

  setPeriod(period: { month: number, year: number, subdivisionId: number }) {
    if (period.year && period.month !==null) {
      this.shiftTable = null; // сброс расписания старого периода
      this.prolongationActive = false;
      this.currentPeriod = period;
      let from = new Date(period.year, period.month, 1);
      let to = new Date(period.year, period.month + 1, 0);

      this.headerDays = [];
      for (let i = 1; i <= to.getDate(); i++) {
        this.headerDays.push(i);
      }

      from.setHours(new Date().getTimezoneOffset() / (-60)); // todo: перенести танцы со временем в сервис
      to.setHours(new Date().getTimezoneOffset() / (-60)); // todo: перенести танцы со временем в сервис

      this.pss.getShifts(from.toISOString().slice(0, -14), to.toISOString().slice(0, -14), this.user.mePerformer.performer.subdivisionFK.id);
    }
  }

  makeShiftStyle(display) {
    let style = 'left: ' + display[0] + '%;' + 'width:' + (display[1] - display[0]) + '%;';
    return this.sanitizer.bypassSecurityTrustStyle(style);
  }

  openShiftList(day, performer, index) {
    if (
      !(this.pss.mode === 'original' && this.access.checkAccessWrite({level: 'shiftControl'})) &&
      !(this.pss.mode !== 'original' && this.access.checkAccessWrite({level: 'aviationModule'}))
    ) {
      return;
    }
    if (day) {
      const sw = this.modal.open(ModalPerformerShiftListComponent);
      sw.componentInstance.shifts = day.shifts;
      sw.componentInstance.performer = performer;
      sw.result.then(
        res => {
          if (res) {
            if (res.type === 'edit') {
              this.updateShift(performer, new Date(this.currentPeriod.year, this.currentPeriod.month, index + 1), day.shifts, res.shift);
            } else if (res.type === 'delete') {
              this.deleteShift(res.shift);
            } else if (res.type === 'new') {
              this.updateShift(performer, new Date(this.currentPeriod.year, this.currentPeriod.month, index + 1), day.shifts);
            }
          }
        },
        () => {
        }
      );
    } else {
      this.updateShift(performer, new Date(this.currentPeriod.year, this.currentPeriod.month, index + 1))
    }

  }

  updateShift(performer: PerformerBean, date: Date, existingShifts?: PerformerShiftBean[], editingShift?: PerformerShiftBean) {
    const cShift = this.modal.open(ModalPerformerUpdateShiftComponent);
    cShift.componentInstance.performer = performer;
    cShift.componentInstance.date = date;
    cShift.componentInstance.existingShifts = existingShifts; // уже существующие смены для отслеживния пересечений
    if (editingShift) cShift.componentInstance.shiftItem = editingShift; // смена для редактирвоания

    cShift.result.then(
      res => {
        if (res) {
          this.pss.updateShift(res).subscribe(
            (ans) => {
              this.ns.success('Успешно', 'Расписание обновлено');
            },
            error => {
              this.ns.error('Ошибка', 'Не удалось обновить расписание');
            }
          );
        }
      },
      () => {
      }
    );
  }

  deleteShift(shift: PerformerShiftBean) {
    this.pss.deleteShift(shift).subscribe(
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

  addForLong(row) { // выбор сотрудника для пролонгации
    row.selected = !row.selected;
    this.shiftTable.shifts.findIndex(s => s.selected);
    this.prolongationActive = -1 < this.shiftTable.shifts.findIndex(s => s.selected);
  }

  prolongationDelete() {
    const pm = this.modal.open(ModalPerformerProlongationDeleteComponent);
    pm.componentInstance.period ={
      dateFrom: new Date(this.currentPeriod.year, this.currentPeriod.month, 1),
      dateTo: new Date(this.currentPeriod.year, this.currentPeriod.month+1, 0)
    };
    pm.result.then(
      res => {
        let performersIds = [];
        this.shiftTable.shifts.forEach(
          s => {
            if (s.selected) performersIds.push(s.performer.id);
          }
        );
        this.resetSection();
        console.log('delete', res, performersIds);
        this.pss.prolongationDelete(performersIds, res.dateFrom.toISOString().slice(0, -14), res.dateTo.toISOString().slice(0, -14)).subscribe( // todo: перенести танцы со временем в сервис
          (ans) => {
            this.ns.success('Успешно', 'Расписание обновлено');
            this.setPeriod(this.form.getRawValue());
            this.resetSection();

          },
          error => {
            this.ns.error('Ошибка', 'Не удалось обновить расписание');
            console.log(error);
          }
        );
      }
    );


  }

  prolongation() {
    const pm = this.modal.open(ModalPerformerProlongationComponent);
    pm.componentInstance.period ={
      dateFrom: new Date(this.currentPeriod.year, this.currentPeriod.month, 1),
      dateTo: new Date(this.currentPeriod.year, this.currentPeriod.month+1, 0)
    };
    pm.result.then(
      res => {
        let performersIds = [];
        this.shiftTable.shifts.forEach(
          s => {
            if (s.selected) performersIds.push(s.performer.id);
          }
        );
        this.pss.prolongation(performersIds, res.dateFrom.toISOString().slice(0, -14), res.dateTo.toISOString().slice(0, -14)).subscribe( // todo: перенести танцы со временем в сервис
          (ans) => {
            this.ns.success('Успешно', 'Расписание обновлено');
            this.setPeriod(this.form.getRawValue());
            this.resetSection();
          },
          error => {
            this.ns.error('Ошибка', 'Не удалось обновить расписание');
            console.log(error);
          }
        );
      }
    );
  }

  resetSection() {
    this.shiftTable.shifts.forEach(s => s.selected = false);
    this.prolongationActive = false;
  }

  printReport() {
    let report: IReport = reportsList.find(r => r.block === 'scheduleEmployes');
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
