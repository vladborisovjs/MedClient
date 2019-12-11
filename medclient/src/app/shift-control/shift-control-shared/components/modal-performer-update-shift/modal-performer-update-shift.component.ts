import {Component, Input, OnInit} from '@angular/core';
import {PerformerBean, PerformerShiftBean} from "../../../../../../swagger/med-api.service";
import {FormControl, FormGroup} from "@angular/forms";
import {ISimpleDescription} from "../../../../shared/simple-control/services/simple-description.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {PerformerShiftService} from "../../services/performer-shift.service";

@Component({
  selector: 'app-modal-performer-update-shift',
  templateUrl: './modal-performer-update-shift.component.html',
  styleUrls: ['./modal-performer-update-shift.component.scss']
})
export class ModalPerformerUpdateShiftComponent implements OnInit {
  @Input() performer: PerformerBean;
  @Input() date: Date;
  @Input() existingShifts: PerformerShiftBean[];
  @Input() shiftItem: PerformerShiftBean = PerformerShiftBean.fromJS(
    {isDeleted: false, id: 0}
  );

  descriptions: ISimpleDescription[] = [
    {
      label: 'По графику',
      type: 'checkbox',
      styleClass: 'col-4',
      key: 'isBasic',
      additional: {
        block: 'type'
      }
    },
    {
      label: 'Тип',
      key: 'scheduleTypeFK',
      type: 'dict',
      styleClass: 'col-12 line-form',
      // bindValue: 'scheduleTypeFK',
      addLabel: 'code',
      dict: 'getScheduleTypeListUsingGET',
    },
    {
      label: 'Начало',
      key: 'dateFrom',
      type: 'date',
      // timeOnlyWithDate: this.date,
      styleClass: 'line-form col-12',
      additional: {
        block: 'schedule'
      }
    },
    {
      label: 'Окончание',
      key: 'dateTo',
      type: 'date',
      // timeOnlyWithDate: this.date,
      styleClass: 'line-form col-12',
      additional: {
        block: 'schedule'
      }
    },
  ];

  form: FormGroup = new FormGroup(
    {
      isBasic: new FormControl(true),
      scheduleTypeFK: new FormControl(),
      dateFrom: new FormControl(),
      dateTo: new FormControl(),
    }
  );

  canSave: boolean;
  tooLongShift: boolean; // признак если смена больше суток

  constructor(private modalInstance: NgbActiveModal, private pss: PerformerShiftService) {
  }

  ngOnInit() {
    this.shiftItem.performerFK = this.shiftItem.performerFK || this.performer;
    this.form.valueChanges.subscribe(
      ch => {
        this.tooLongShift = false;
        if (ch.isBasic) {
          this.form.controls['dateFrom'].disable({emitEvent: false});
          this.form.controls['dateTo'].disable({emitEvent: false});
          this.form.controls['scheduleTypeFK'].enable({emitEvent: false});
        } else {
          this.form.controls['dateFrom'].enable({emitEvent: false});
          this.form.controls['dateTo'].enable({emitEvent: false});
          this.form.controls['scheduleTypeFK'].disable({emitEvent: false});
          this.form.controls['scheduleTypeFK'].setValue(null, {emitEvent: false});

          if (ch.dateFrom && ch.dateTo){
            ch.dateTo.setSeconds(0); //обрезка секунд
            ch.dateFrom.setSeconds(0); //обрезка секунд
            this.tooLongShift = (ch.dateTo.valueOf() - ch.dateFrom.valueOf())/this.pss.dayMs > 1;
          }
        }

        if (ch.scheduleTypeFK && ch.isBasic) {
          let startDate = new Date(this.date);
          let endDate = new Date(this.date);
          startDate.setHours(ch.scheduleTypeFK.timeFrom.slice(0, 2));
          startDate.setMinutes(ch.scheduleTypeFK.timeFrom.slice(-2));
          endDate.setHours(ch.scheduleTypeFK.timeTo.slice(0, 2));
          endDate.setMinutes(ch.scheduleTypeFK.timeTo.slice(-2));
          if(startDate >= endDate){
            endDate.setDate(endDate.getDate()+1); // если переходящие расписание
          }
          this.form.controls['dateFrom'].setValue(startDate, {emitEvent: false});
          this.form.controls['dateTo'].setValue(endDate, {emitEvent: false});
        }

        if(!ch.scheduleTypeFK && ch.isBasic){
          this.form.controls['dateFrom'].setValue(null, {emitEvent: false});
          this.form.controls['dateTo'].setValue(null, {emitEvent: false});
        }


        let item: PerformerShiftBean = this.form.getRawValue();
        this.canSave = !!(item.isBasic && item.scheduleTypeFK && item.scheduleTypeFK.id) ||
          !!(!item.isBasic && item.dateFrom && item.dateTo && !this.tooLongShift);
      }
    );

    if (this.shiftItem.id){ // редактирование смены
      if (this.shiftItem.scheduleTypeFK && this.shiftItem.scheduleTypeFK.id) this.shiftItem.isBasic = true;
      this.form.reset(this.shiftItem);
    } else { // создание смены
      this.form.controls['dateFrom'].disable({emitEvent: false});
      this.form.controls['dateTo'].disable({emitEvent: false});
    }
  }

  updateShift(){
    Object.assign(this.shiftItem, this.form.getRawValue());
    this.shiftItem.dateTo.setSeconds(0); //обрезка секунд
    this.shiftItem.dateFrom.setSeconds(0); //обрезка секунд
    this.modalInstance.close(this.shiftItem);
  }

  back() {
    this.modalInstance.dismiss();
  }

}
