import {Component, Input, OnInit} from '@angular/core';
import {
  BrigadeBean,
  BrigadeScheduleBean,
} from "../../../../../../swagger/med-api.service";
import {ISimpleDescription} from "../../../../shared/simple-control/services/simple-description.service";
import {FormControl, FormGroup} from "@angular/forms";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ModalBrigadeAddPerformerComponent} from "../modal-brigade-add-performer/modal-brigade-add-performer.component";
import {BrigadeShiftService} from "../../services/brigade-shift.service";
import {ModalBrigadeAddTransportComponent} from "../modal-brigade-add-transport/modal-brigade-add-transport.component";

@Component({
  selector: 'app-modal-brigade-update-shift',
  templateUrl: './modal-brigade-update-shift.component.html',
  styleUrls: ['./modal-brigade-update-shift.component.scss']
})
export class ModalBrigadeUpdateShiftComponent implements OnInit {
  @Input() brigade: BrigadeBean;
  @Input() date: Date;
  @Input() subdivisionId: number;
  @Input() existingShifts: BrigadeScheduleBean[];
  @Input() shiftItem: BrigadeScheduleBean = BrigadeScheduleBean.fromJS(
    {
      isDeleted: false,
      id: 0,
      isAvailable: this.bss.mode === 'aviation',
    }
  );


  notEquipped: boolean; // укомплектованность бригады
  correctTime: boolean = true; // Время начала меньше времени конца

  descriptions: ISimpleDescription[] = [
    {
      label: 'Начало',
      key: 'dateFrom',
      type: 'date',
      required: true,
      // timeOnlyWithDate: this.date,
      styleClass: 'col-6',
      additional: {
        block: 'schedule'
      }
    },
    {
      label: 'Окончание',
      key: 'dateTo',
      type: 'date',
      required: true,
      // timeOnlyWithDate: this.date,
      styleClass: 'col-6',
      additional: {
        block: 'schedule'
      }
    },
  ];

  form: FormGroup = new FormGroup(
    {
      dateFrom: new FormControl(),
      dateTo: new FormControl(),
      isBasic: new FormControl(true),
      scheduleTypeFK: new FormControl(),
    }
  );

  constructor(private modalInstance: NgbActiveModal,
              private modal: NgbModal,
              private bss: BrigadeShiftService,) {
  }

  ngOnInit() {
    this.shiftItem.brigade = this.shiftItem.brigade || this.brigade.id;

    if (this.shiftItem.id) { // если редактирование смены то нельзя редактировать
      this.form.disable()
    } else {
      if (this.existingShifts && this.existingShifts.length) {
        this.shiftItem.dateFrom = new Date(
          this.date.getFullYear(),
          this.date.getMonth(),
          this.date.getDate(),
          this.existingShifts[this.existingShifts.length - 1].dateFrom.getHours(),
          this.existingShifts[this.existingShifts.length - 1].dateFrom.getMinutes());
        this.shiftItem.dateTo = new Date(
          this.date.getFullYear(),
          this.date.getMonth(),
          this.date.getDate() + 1,
          this.existingShifts[this.existingShifts.length - 1].dateTo.getHours(),
          this.existingShifts[this.existingShifts.length - 1].dateTo.getMinutes()
        );
      } else {
        this.shiftItem.dateFrom = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate(), 8);
        this.shiftItem.dateTo = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate(), 20);
      }
    }
    this.form.reset(this.shiftItem);
    this.form.valueChanges.subscribe(ch => Object.assign(this.shiftItem, ch));
  }

  updateShift() {
    this.shiftItem.dateTo.setSeconds(0); //обрезка секунд
    this.shiftItem.dateFrom.setSeconds(0); //обрезка секунд
    if (this.checkTransportAndPerformers()) {
      this.modalInstance.close(this.shiftItem);
    }
  }

  addPerformer() {
    const ad = this.modal.open(ModalBrigadeAddPerformerComponent);
    ad.componentInstance.dateFrom = this.form.controls['dateFrom'].value;
    ad.componentInstance.dateTo = this.form.controls['dateTo'].value;
    ad.componentInstance.subdivisionId = this.subdivisionId;
    ad.componentInstance.selectedPerformers = this.shiftItem.performerScheduleList;
    ad.result.then(
      res => {
        if (res) {
          this.shiftItem.performerScheduleList = this.shiftItem.performerScheduleList || [];
          this.shiftItem.performerScheduleList.push(res);
          this.form.disable() // нельзя редактировать если есть сотрудники или транспорт
        }
      },
      () => []
    );
  }

  addTransport() {
    const ad = this.modal.open(ModalBrigadeAddTransportComponent);
    ad.componentInstance.dateFrom = this.form.controls['dateFrom'].value;
    ad.componentInstance.dateTo = this.form.controls['dateTo'].value;
    ad.componentInstance.selectedTransport = this.shiftItem.transportScheduleList;
    ad.componentInstance.subdivisionId = this.subdivisionId;
    ad.result.then(
      res => {
        if (res) {
          this.shiftItem.transportScheduleList = [res];
          this.form.disable() // нельзя редактировать если есть сотрудники или транспорт
        }
      },
      () => []
    );
  }

  // changeTransport(){
  //   const ad = this.modal.open(ModalBrigadeAddTransportComponent);
  //   ad.componentInstance.dateFrom = this.form.controls['dateFrom'].value;
  //   ad.componentInstance.dateTo = this.form.controls['dateTo'].value;
  //   ad.componentInstance.selectedTransport = this.shiftItem.transportScheduleList;
  //   ad.componentInstance.subdivisionId = this.subdivisionId;
  //   ad.result.then(
  //     res => {
  //       if (res) {
  //         this.shiftItem.transportScheduleList = this.shiftItem.transportScheduleList || [];
  //         this.shiftItem.transportScheduleList.push(res);
  //         this.form.disable() // нельзя редактировать если есть сотрудники или транспорт
  //       }
  //     },
  //     () => []
  //   );
  // }

  checkTransportAndPerformers(): boolean {
    let canSave: boolean;
    if (this.bss.mode === 'original') {
      canSave = !!(
        this.shiftItem.performerScheduleList &&
        this.shiftItem.performerScheduleList.some(medic => medic.performerFK.typeFK.groupCode === 0) &&
        this.shiftItem.performerScheduleList.some(medic => medic.performerFK.typeFK.groupCode === 1) &&
        this.shiftItem.transportScheduleList && this.shiftItem.transportScheduleList.length
      );
    } else if (this.bss.mode === 'aviation'){
      canSave = !!(
        this.shiftItem.performerScheduleList &&
        this.shiftItem.performerScheduleList.some(medic => medic.performerFK.typeFK.groupCode === 3) &&
        this.shiftItem.performerScheduleList.some(medic => medic.performerFK.typeFK.groupCode === 4) &&
        this.shiftItem.transportScheduleList && this.shiftItem.transportScheduleList.length
      );
    }
    this.notEquipped = !canSave;
    this.correctTime = this.shiftItem.dateFrom < this.shiftItem.dateTo;
    return canSave && this.correctTime;
  }

  back() {
    this.modalInstance.dismiss();
  }

}
