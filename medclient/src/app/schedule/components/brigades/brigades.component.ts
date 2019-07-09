import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ScheduleService} from '../../services/schedule.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {debounce} from 'rxjs/operators';
import {interval} from 'rxjs';
import {ModalBrigadeScheduleItemComponent} from '../modal-brigade-schedule-item/modal-brigade-schedule-item.component';
import {ModalAddPerformerScheduleComponent} from '../modal-add-performer-schedule/modal-add-performer-schedule.component';
import {ModalAddBrigadeScheduleComponent} from '../modal-add-brigade-schedule/modal-add-brigade-schedule.component';

@Component({
  selector: 'app-brigades',
  templateUrl: './brigades.component.html',
  styleUrls: ['./brigades.component.scss']
})
export class BrigadesComponent implements OnInit {
  scheduleList: any[] = [];
  scheduleDatesColumns: any[] = [];
  dateLabels: number[] = [];
  form = new FormGroup({
    position: new FormControl(),
    month: new FormControl(),
    year: new FormControl(),
  });
  months = [
    {
      label: 'Январь',
      id: 0,
    },
    {
      label: 'Февраль',
      id: 1
    },
    {
      label: 'Март',
      id: 2
    },
    {
      label: 'Апрель',
      id: 3,
    },
    {
      label: 'Май',
      id: 4
    },
    {
      label: 'Июнь',
      id: 5
    },
    {
      label: 'Июль',
      id: 6,
    },
    {
      label: 'Август',
      id: 7
    },
    {
      label: 'Сентябрь',
      id: 8
    },
    {
      label: 'Октябрь',
      id: 9,
    },
    {
      label: 'Ноябрь',
      id: 10
    },
    {
      label: 'Декабрь',
      id: 11
    },
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
    this.schs.getCalendarScheduleBrigades(f.toISOString(), t.toISOString()).subscribe(
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
    if (e.duty){
      this.showScheduleList(e.brigade, e.date, e.duty);
    } else {
      this.addSchedule(e.brigade, e.date);
    }

  }

  addSchedule(brigade, date){
    console.log('add schedule', brigade, date);
    const addSch = this.modal.open(ModalAddBrigadeScheduleComponent, {size: 'lg'});
    addSch.componentInstance.brigade = brigade;
    addSch.componentInstance.date = date;
    addSch.result.then(
      res => {
        let v = this.form.getRawValue();
        this.updateTable(v.year, v.month)
      }
    );
  }

  editSchedule(brigade, date, duty){
    console.log('add schedule', brigade, date);
    const addSch = this.modal.open(ModalAddBrigadeScheduleComponent, {size: 'lg'});
    addSch.componentInstance.brigade = brigade;
    addSch.componentInstance.date = date;
    addSch.componentInstance.duty = duty;
    addSch.result.then(
      res => {
        let v = this.form.getRawValue();
        this.updateTable(v.year, v.month)
      }
    );
  }

  showScheduleList(brigade, date, duty){
    const schItem = this.modal.open(ModalBrigadeScheduleItemComponent);
    schItem.componentInstance.brigade = brigade;
    schItem.componentInstance.duty = duty;
    schItem.componentInstance.date = date;
    schItem.result.then(
      res => {
        if (res === 'edit'){
          this.editSchedule(brigade, date, duty);
        } else {
          let v = this.form.getRawValue();
          this.updateTable(v.year, v.month)
        }
      }
    );
  }

}
