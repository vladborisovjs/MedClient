import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ScheduleService} from '../../services/schedule.service';
import {NotificationsService} from 'angular2-notifications';

@Component({
  selector: 'app-modal-performer-schedule-list',
  templateUrl: './modal-performer-schedule-list.component.html',
  styleUrls: ['./modal-performer-schedule-list.component.scss']
})
export class ModalPerformerScheduleListComponent implements OnInit {
@Input() duty: any;
@Input() performer: any;
@Input() date: any;
  constructor(private modalInstance: NgbActiveModal,
              private schs: ScheduleService,
              private ns: NotificationsService) { }

  ngOnInit() {
    console.log(this.performer, this.duty);
  }

  back() {
    this.modalInstance.dismiss();
  }

  addDuty(){
    this.modalInstance.close('addDuty');
  }

  editDuty(){
    this.modalInstance.close('editDuty');
  }

  deleteDuty(duty){
    console.log(duty);
    this.schs.deletePerformerSchedule(this.duty.id).subscribe(
      (res) => {
        this.modalInstance.close('delete');
        this.ns.success('Успешно', 'Смена сотрудника удалена!')
      }
    );
  }

}
