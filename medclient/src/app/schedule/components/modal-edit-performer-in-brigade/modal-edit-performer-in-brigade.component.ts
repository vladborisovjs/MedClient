import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-modal-edit-performer-in-brigade',
  templateUrl: './modal-edit-performer-in-brigade.component.html',
  styleUrls: ['./modal-edit-performer-in-brigade.component.scss']
})
export class ModalEditPerformerInBrigadeComponent implements OnInit {
@Input() performerInfo: any;
desc: ISimpleDescription[] = [
  {
    label: 'c: ',
    key: 'date_from',
    type: 'date',
    styleClass: 'line-form col-12'
  },
  {
    label: 'по: ',
    key: 'date_to',
    type: 'date',
    styleClass: 'line-form col-12'
  },
];
form: FormGroup;
  constructor(private modalInstance: NgbActiveModal, private sds: SimpleDescriptionService) { }

  ngOnInit() {
    this.form = this.sds.makeForm(this.desc);
    this.form.reset(this.performerInfo.period_details);
  }

  back() {
    this.modalInstance.dismiss();
  }

  save() {
    this.performerInfo.period_details = this.form.getRawValue();
    this.modalInstance.close(this.performerInfo);
  }

}
