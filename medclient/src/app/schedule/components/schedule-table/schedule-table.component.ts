import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-schedule-table',
  templateUrl: './schedule-table.component.html',
  styleUrls: ['./schedule-table.component.scss']
})
export class ScheduleTableComponent implements OnInit, OnChanges {
  @Input() rows: any[];
  @Input() mode: string; // performers, brigades
  @Input() dates: any[];
  @Input() dateLabels: string[];
  @Output() clickDateEvent = new EventEmitter();
  @Output() selectRowEvent = new EventEmitter();
  selectedRows: any[] = [];

  constructor() {
  }

  ngOnInit() {
    this.makeSchedule();
  }

  ngOnChanges(e) {
    if (e.rows)
      this.makeSchedule();
  }

  clickDate(e) {
    this.clickDateEvent.emit(e);
  }

  selectData(e, row) {
    // this.selectRowEvent.emit(e);

    if (this.selectedRows.includes(row)) {
      this.selectedRows.splice(this.selectedRows.indexOf(row), 1);
    } else {
      this.selectedRows.push(row);
    }
    // console.log(this.selectedRows);
    this.selectRowEvent.emit(this.selectedRows);
  }

  checkElement(row, selectedRows) {
    return !!selectedRows.includes(row);
  }

  makeSchedule() {
    // console.log('ROWS DATALABELS DATES', this.rows, this.dateLabels, this.dates)
    let seconds: any[] = [];
    for (let i = 0; i < this.rows.length; i++) {
      seconds = [];
      this.rows[i].second.forEach(second => {
        if (second) {
          // if (new Date(second.dateFrom).getDate() !== new Date(second.dateTo).getDate()) {
          if (false) {
            this.dateLabels.forEach(el => {
              if (seconds[+el - 1] === undefined)
                seconds.push(null)
            })
          } else {
            this.dateLabels.forEach(el => {
              if (this.dates[+el - 1].getDate() === new Date(second.dateFrom).getDate()) {
                seconds.splice(+el - 1, 1, second);
              } else if (seconds[+el - 1] === undefined) {
                seconds.push(null);
              }
            })
          }
        }
      });
      if (this.rows[i].second.length === 0) {
        // console.log('YA V PUSTo')
        this.dateLabels.forEach(el => {
          if (seconds[+el - 1] === undefined) {
            seconds.push(null)
          }
        })
      }
      this.rows[i].second = seconds;
    }
    console.log('rows', this.rows);
  }

}
