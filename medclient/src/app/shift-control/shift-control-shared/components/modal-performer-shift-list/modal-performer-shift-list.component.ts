import {Component, Input, OnInit} from '@angular/core';
import {PerformerBean, PerformerShiftBean} from "../../../../../../swagger/med-api.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {CustomModalService} from "../../../../shared/modal/services/custom-modal.service";

@Component({
  selector: 'app-modal-performer-shift-list',
  templateUrl: './modal-performer-shift-list.component.html',
  styleUrls: ['./modal-performer-shift-list.component.scss']
})
export class ModalPerformerShiftListComponent implements OnInit {
  @Input() shifts: PerformerShiftBean[];
  @Input() performer: PerformerBean;

  constructor(private modalInstance: NgbActiveModal,
              private cmodal: CustomModalService,) {
  }

  ngOnInit() {
    console.log(this.performer, this.shifts);
  }

  back() {
    this.modalInstance.dismiss();
  }

  deleteShift(shift: PerformerShiftBean) {
    this.cmodal.confirm('Удаление смены', 'Удалить смену сотрудника?').then(
      res => {
        if (res){
          shift.performerFK = this.performer; // указываем перформера для обновления таблицы после удаления
          this.modalInstance.close({type: 'delete', shift: shift});
        }
      },
      () => {}
    );
  }

  updateShift(shift) {
    this.modalInstance.close({type: 'edit', shift: shift});
  }

  createShift() {
    this.modalInstance.close({type: 'new'});
  }

}
