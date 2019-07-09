import { Component, OnInit } from '@angular/core';
import {ScheduleService} from '../../services/schedule.service';
import {FormControl, FormGroup} from '@angular/forms';
import {debounce} from 'rxjs/operators';
import {interval} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalAddPerformerScheduleComponent} from '../modal-add-performer-schedule/modal-add-performer-schedule.component';
import {ModalPerformerScheduleListComponent} from '../modal-performer-schedule-list/modal-performer-schedule-list.component';
import {ModalProlongationComponent} from '../modal-prolongation/modal-prolongation.component';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {
scheduleList: any[] = [];
scheduleDatesColumns: any[] = [];
dateLabels: number[] = [];
form = new FormGroup({
  position: new FormControl(),
  month: new FormControl(),
  year: new FormControl(),
});

months = [
  { label: 'Январь', id: 0,},
  { label: 'Февраль', id: 1},
  { label: 'Март', id: 2},
  { label: 'Апрель',id: 3},
  { label: 'Май', id: 4},
  { label: 'Июнь', id: 5},
  { label: 'Июль', id: 6,},
  { label: 'Август',id: 7},
  { label: 'Сентябрь',id: 8},
  { label: 'Октябрь', id: 9},
  { label: 'Ноябрь',id: 10},
  { label: 'Декабрь',id: 11},
  ];
  constructor(private schs: ScheduleService, private modal: NgbModal) { }

  ngOnInit() {
    this.form.valueChanges.pipe( debounce(() => interval(300))).subscribe(
      changes => {
        console.log(changes);
        this.updateTable(changes.year, changes.month)
      }
    );
    this.form.reset({year: new Date().getFullYear(), month: new Date().getMonth()});
  }

  updateTable(year: number, month: number){
    let f = new Date(year, month, 1, 3);
    let t = new Date(year, month+1, 1, 3);
    t.setDate(t.getDate() - 1);
    this.scheduleDatesColumns = [];
    this.dateLabels = [];
    this.scheduleList = [];
    this.schs.getCalendarSchedulePerfomers(f.toISOString(), t.toISOString()).subscribe(
      res => {
        this.scheduleDatesColumns = res.columns;
        this.scheduleList = res.list;
        res.columns.forEach(
          col => {
            this.dateLabels.push(new Date(col).getDate());
          }
        );
      }
    );
  }

  openSchedule(e){
    console.log(e);
    if (e.duty){
     this.showScheduleList(e.performer, e.date, e.duty);
    } else {
      this.addSchedule(e.performer, e.date);
    }
  }

  addSchedule(performer, date){
    const addSch = this.modal.open(ModalAddPerformerScheduleComponent);
    addSch.componentInstance.performer = performer;
    addSch.componentInstance.date = date;
    addSch.result.then(
      res => {
        let v = this.form.getRawValue();
        this.updateTable(v.year, v.month)
      }
    );
  }

  editSchedule(performer, date, duty){
    const addSch = this.modal.open(ModalAddPerformerScheduleComponent);
    addSch.componentInstance.performer = performer;
    addSch.componentInstance.date = date;
    addSch.componentInstance.duty = duty;
    addSch.result.then(
      res => {
        let v = this.form.getRawValue();
        this.updateTable(v.year, v.month)
      }
    );
  }



  showScheduleList(performer, date, duty){
    const showSchList = this.modal.open(ModalPerformerScheduleListComponent);
    showSchList.componentInstance.duty = duty;
    showSchList.componentInstance.performer = performer;
    showSchList.componentInstance.date = date;
    showSchList.result.then(
      res => {
        if (res === 'addDuty'){
          this.addSchedule(performer, date);
        }else if (res === 'editDuty'){
          this.editSchedule(performer, date, duty);
        } else if (res === 'delete') {
          let v = this.form.getRawValue();
          this.updateTable(v.year, v.month)
        }
      },
      err => {}
    );
  }

  prolongation(){
    const plong = this.modal.open(ModalProlongationComponent);
  }

}
