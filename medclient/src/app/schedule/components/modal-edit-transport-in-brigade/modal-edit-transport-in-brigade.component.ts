import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {FormGroup} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-edit-transport-in-brigade',
  templateUrl: './modal-edit-transport-in-brigade.component.html',
  styleUrls: ['./modal-edit-transport-in-brigade.component.scss']
})
export class ModalEditTransportInBrigadeComponent implements OnInit, AfterViewInit {
  @Input() transportInfo: any;
  desc: ISimpleDescription[] = [
    {
      label: 'c: ',
      key: 'dateFrom',
      type: 'date',
      styleClass: 'line-form col-12'
    },
    {
      label: 'по: ',
      key: 'dateTo',
      type: 'date',
      styleClass: 'line-form col-12'
    },
  ];
  form: FormGroup;
  constructor(private modalInstance: NgbActiveModal, private sds: SimpleDescriptionService) { }

  ngOnInit() {
    this.form = this.sds.makeForm(this.desc);
    // this.form.reset(this.transportInfo.period_details);
  }

  ngAfterViewInit() {
    this.form.get('dateFrom').setValue(this.transportInfo.dateFrom);
    this.form.get('dateTo').setValue(this.transportInfo.dateTo)
  }

  back() {
    this.modalInstance.dismiss();
  }

  save() {
    Object.assign(this.transportInfo, this.form.getRawValue());
    this.modalInstance.close(this.transportInfo);
  }

}
