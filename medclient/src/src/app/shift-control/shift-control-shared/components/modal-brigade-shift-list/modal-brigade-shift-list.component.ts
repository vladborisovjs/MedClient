import {Component, Input, OnInit} from '@angular/core';
import {BrigadeBean, BrigadeScheduleBean} from "../../../../../../swagger/med-api.service";
import {BrigadeShiftService} from "../../services/brigade-shift.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {CustomModalService} from "../../../../shared/modal/services/custom-modal.service";

@Component({
  selector: 'app-modal-brigade-shift-list',
  templateUrl: './modal-brigade-shift-list.component.html',
  styleUrls: ['./modal-brigade-shift-list.component.scss']
})
export class ModalBrigadeShiftListComponent implements OnInit {
  @Input() brigade: BrigadeBean;
  @Input() shiftIds: number[];
  shifts: BrigadeScheduleBean[];

  constructor(private bss: BrigadeShiftService,
              private modalInstance: NgbActiveModal,
              private cmodal: CustomModalService) {
  }

  ngOnInit() {
    console.log(this.brigade);
    this.bss.getShiftList(this.shiftIds).subscribe(
      (res: BrigadeScheduleBean[]) => {
        console.log('->>>', res);
        this.shifts = res;
      }
    )
  }

  updateShift(shift) {
    this.modalInstance.close({type: 'edit', shift: shift});
  }

  deleteShift(shift) {
    this.cmodal.confirm('Удаление смены', 'Удалить смену бригады?').then(
      res => {
        if (res){
          // shift.performerFK = this.performer; // указываем перформера для обновления таблицы после удаления
          this.modalInstance.close({type: 'delete', shift: shift});
        }
      },
      () => {}
    );
  }

  createShift() {
    this.modalInstance.close({type: 'new'});
  }

  back() {
    this.modalInstance.dismiss();
  }
}
