import { Component, OnInit } from '@angular/core';
import {
  ISimpleDescription,
  SimpleDescriptionService
} from "../../../shared/simple-control/services/simple-description.service";
import {FormGroup} from "@angular/forms";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-modal-reject-request',
  templateUrl: './modal-reject-request.component.html',
  styleUrls: ['./modal-reject-request.component.scss']
})
export class ModalRejectRequestComponent implements OnInit {
  description: ISimpleDescription[] = [
    {
      label: 'Причина отказа',
      type: 'textarea',
      rows: 4,
      key: 'description',
      required: true
    }
  ];
  form: FormGroup;

  constructor(private modalInstance: NgbActiveModal, private sds: SimpleDescriptionService) { }

  ngOnInit() {
    this.form = this.sds.makeForm(this.description);
  }

  submit(){
    this.modalInstance.close(this.form.getRawValue());
  }

  back(){
    this.modalInstance.dismiss();
  }

}
