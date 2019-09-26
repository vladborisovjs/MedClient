import { Component, OnInit } from '@angular/core';
import {ScheduleService} from '../../services/schedule.service';
import {FormControl, FormGroup} from '@angular/forms';
import {debounce} from 'rxjs/operators';
import {interval} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalAddPerformerScheduleComponent} from '../modal-add-performer-schedule/modal-add-performer-schedule.component';
import {ModalPerformerScheduleListComponent} from '../modal-performer-schedule-list/modal-performer-schedule-list.component';
import {ModalProlongationComponent} from '../modal-prolongation/modal-prolongation.component';
import {DatePipe} from "@angular/common";
import {ModalProlongationDeleteComponent} from '../modal-prolongation-delete/modal-prolongation-delete.component';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {
scheduleList: any[] = [];
shiftsList: any[] = [];
scheduleDatesColumns: any[] = [];
dateLabels: number[] = [];
form = new FormGroup({
  position: new FormControl(),
  month: new FormControl(),
  year: new FormControl(),
});
selectedPerformers: any[] = [];
datePipe: DatePipe = new DatePipe('ru');

months = [
  { label: 'Январь', id: 0, },
  { label: 'Февраль', id: 1},
  { label: 'Март', id: 2},
  { label: 'Апрель', id: 3},
  { label: 'Май', id: 4},
  { label: 'Июнь', id: 5},
  { label: 'Июль', id: 6, },
  { label: 'Август', id: 7},
  { label: 'Сентябрь', id: 8},
  { label: 'Октябрь', id: 9},
  { label: 'Ноябрь', id: 10},
  { label: 'Декабрь', id: 11},
  ];
  constructor(private schs: ScheduleService, private modal: NgbModal) { }

  ngOnInit() {
    this.form.valueChanges.pipe( debounce(() => interval(300))).subscribe(
      changes => {
        console.log(changes);
        this.updateTable(changes.year, changes.month);
      }
    );
    this.form.reset({year: new Date().getFullYear(), month: new Date().getMonth()});
  }

  updateTable(year: number, month: number) {
    const from = new Date(year, month, 1);
    const to = new Date(year, month + 1, 1);
    console.log(from, to);
    // this.datePipe.transform(from, 'yyyy-MM-dd');
    this.scheduleDatesColumns = [];
    this.dateLabels = [];
    this.scheduleList = [];
    this.schs.getCalendarSchedulePerfomers(from.toISOString(), to.toISOString()).subscribe(
      res => {
        to.setDate(to.getDate() - 1);
        for (let i = from.getDate(); i <= to.getDate(); i++) {
          this.dateLabels.push(i);
          this.scheduleDatesColumns.push(new Date(year, month, i));
        }
        for (let i = 0; i < res.length; i++) {
          this.scheduleList.push(res[i]);
        }
      }
    );
  }

  openSchedule(e) {
    console.log(e);
    if (e.duty) {
     this.showScheduleList(e.performerFK, e.date, e.duty);
    } else {
      this.addSchedule(e.performerFK, e.date);
    }
  }

  addSchedule(performerFK, date) {
    const addSch = this.modal.open(ModalAddPerformerScheduleComponent);
    addSch.componentInstance.performer = performerFK;
    addSch.componentInstance.date = date;
    // addSch.componentInstance.performerFK = performerFK;
    addSch.result.then(
      res => {
        const v = this.form.getRawValue();
        this.updateTable(v.year, v.month);
      }
    );
  }

  editSchedule(performer, date, duty) {
    const addSch = this.modal.open(ModalAddPerformerScheduleComponent);
    addSch.componentInstance.performer = performer;
    addSch.componentInstance.date = date;
    addSch.componentInstance.duty = duty;
    addSch.result.then(
      res => {
        const v = this.form.getRawValue();
        this.updateTable(v.year, v.month);
      }
    );
  }



  showScheduleList(performer, date, duty) {
    const showSchList = this.modal.open(ModalPerformerScheduleListComponent);
    showSchList.componentInstance.duty = duty;
    showSchList.componentInstance.performer = performer;
    showSchList.componentInstance.date = date;
    showSchList.result.then(
      res => {
        if (res === 'addDuty') {
          this.addSchedule(performer, date);
        } else if (res === 'editDuty') {
          this.editSchedule(performer, date, duty);
        } else if (res === 'delete') {
          const v = this.form.getRawValue();
          this.updateTable(v.year, v.month);
        }
      },
      err => {}
    );
  }

  prolongation() {
    const plong = this.modal.open(ModalProlongationComponent);
    plong.componentInstance.performers = this.selectedPerformers;
    plong.result.then(
      r => {
        const v = this.form.getRawValue();
         r ? this.updateTable(v.year, v.month): void 0;
      }
    );
  }

  prolongationDelete() {
    const plong = this.modal.open(ModalProlongationDeleteComponent);
    plong.componentInstance.performers = this.selectedPerformers;
    plong.result.then(
      r => {
        const v = this.form.getRawValue();
         r ? this.updateTable(v.year, v.month): void 0;
      }
    );
  }

  selectPerformerRow(e) {
    console.log('event at select', e)
    this.selectedPerformers = e;
  }

}
