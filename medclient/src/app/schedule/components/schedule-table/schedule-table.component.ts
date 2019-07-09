import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-schedule-table',
  templateUrl: './schedule-table.component.html',
  styleUrls: ['./schedule-table.component.scss']
})
export class ScheduleTableComponent implements OnInit {
@Input() rows: any[];
@Input() mode: string; // performers, brigades
@Input() dates: any[];
@Input() dateLabels: string[];
@Output() clickDateEvent = new EventEmitter();

  constructor() { }

  ngOnInit() {
    console.log(this.rows);
  }

  clickDate(e){
    this.clickDateEvent.emit(e);
  }

}
