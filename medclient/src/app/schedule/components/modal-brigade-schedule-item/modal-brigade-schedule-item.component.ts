import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {CustomModalService} from '../../../shared/modal/services/custom-modal.service';
import {ScheduleService} from '../../services/schedule.service';
import {NotificationsService} from 'angular2-notifications';
import {ModalAddBrigadeScheduleComponent} from '../modal-add-brigade-schedule/modal-add-brigade-schedule.component';

@Component({
  selector: 'app-modal-brigade-schedule-item',
  templateUrl: './modal-brigade-schedule-item.component.html',
  styleUrls: ['./modal-brigade-schedule-item.component.scss']
})
export class ModalBrigadeScheduleItemComponent implements OnInit {
  @Input() duty: any;
  @Input() brigade: any;
  @Input() date: any;
  @Input() performerList: any[];
  @Input() transportList: any[];
  constructor(private modalInstance: NgbActiveModal) { }

  ngOnInit() {
    console.log(this)
  }

  goToEdit(){
    this.modalInstance.close('edit');
  }

  back(){
    this.modalInstance.dismiss();
  }
}
