import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {CustomModalService} from '../../../shared/modal/services/custom-modal.service';
import {ScheduleService} from '../../services/schedule.service';
import {NotificationsService} from 'angular2-notifications';

@Component({
  selector: 'app-modal-brigade-schedule-item',
  templateUrl: './modal-brigade-schedule-item.component.html',
  styleUrls: ['./modal-brigade-schedule-item.component.scss']
})
export class ModalBrigadeScheduleItemComponent implements OnInit {
  @Input() duty: any;
  @Input() brigade: any;
  @Input() date: any;
  constructor(private modalInstance: NgbActiveModal,
              private schs: ScheduleService,
              private ns: NotificationsService,
              private cmodal: CustomModalService) { }

  ngOnInit() {
    console.log(this);
  }

  goToEdit(){
    this.modalInstance.close('edit');
  }

  back(){
    this.modalInstance.dismiss();
  }

  deleteDuty() {
    this.cmodal.confirm('Удаление смены', 'Вы уверены, что хотите удалить смену ?').then(
      res => {
        if (res) {
          console.log(res);
          this.schs.deleteBrigadeSchedule(this.brigade.brigadeId, this.duty.id).subscribe(
            res => {
              this.modalInstance.close();
              this.ns.success('Успешно', 'Смена бригады удалена')
            },
            error => {
              this.modalInstance.dismiss();
              this.ns.error('Ошибка', '')
            }
          );

        }
      }
    );
  }
}
