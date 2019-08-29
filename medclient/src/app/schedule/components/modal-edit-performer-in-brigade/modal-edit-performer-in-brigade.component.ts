import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-modal-edit-performer-in-brigade',
  templateUrl: './modal-edit-performer-in-brigade.component.html',
  styleUrls: ['./modal-edit-performer-in-brigade.component.scss']
})
export class ModalEditPerformerInBrigadeComponent implements OnInit, AfterViewInit {
@Input() performerInfo: any;
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
  }

  ngAfterViewInit() {
    this.form.get('dateFrom').setValue(this.performerInfo.dateFrom);
    this.form.get('dateTo').setValue(this.performerInfo.dateTo)
  }

  back() {
    this.modalInstance.dismiss()
  }

  save() {
    Object.assign(this.performerInfo, this.form.getRawValue())
    this.modalInstance.close(this.performerInfo);
  }

}
