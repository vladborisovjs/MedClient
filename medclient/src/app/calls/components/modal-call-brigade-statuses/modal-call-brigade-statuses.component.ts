import {Component, Input, OnInit} from '@angular/core';
import {IPlateInfo} from '../../../shared/info-plate/components/info-plate/info-plate.component';
import {ISimpleDescription} from '../../../shared/simple-control/services/simple-description.service';

@Component({
  selector: 'app-modal-call-brigade-statuses',
  templateUrl: './modal-call-brigade-statuses.component.html',
  styleUrls: ['./modal-call-brigade-statuses.component.scss']
})
export class ModalCallBrigadeStatusesComponent implements OnInit {
  @Input() brigade: any;

  descriptions  = {
    check: {
      label: '',
      type: 'checkbox',
      key: '',
    },
    dt: {
      label: '',
      type: 'date',
      key: '',
    }
  }

  constructor() {
  }

  ngOnInit() {
    console.log(this.brigade);
  }


}
