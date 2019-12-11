import {Component, Input, OnInit} from '@angular/core';
import {BrigadeBean} from "../../../../../swagger/med-api.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {FormControl, FormGroup} from "@angular/forms";
import {ISimpleDescription} from "../../../shared/simple-control/services/simple-description.service";

@Component({
  selector: 'app-modal-call-brigade-remove',
  templateUrl: './modal-call-brigade-remove.component.html',
  styleUrls: ['./modal-call-brigade-remove.component.scss']
})
export class ModalCallBrigadeRemoveComponent implements OnInit {
  @Input() brigade: BrigadeBean;
  form: FormGroup = new FormGroup({
    reason: new FormControl()
  });

  description: ISimpleDescription[] = [
    {
      label: 'Укажите причину',
      key: 'reason',
      type: 'textarea',
      rows: 4
    }
  ];

  constructor(private modalInstance: NgbActiveModal) {
  }

  ngOnInit() {
  }

  back() {
    this.modalInstance.dismiss();
  }

  removeBri() {
    this.modalInstance.close(this.form.getRawValue()['reason']);
  }


}
