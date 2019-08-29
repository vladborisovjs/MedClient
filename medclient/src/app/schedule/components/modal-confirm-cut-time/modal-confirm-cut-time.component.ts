import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-modal-confirm-cut-time',
  templateUrl: './modal-confirm-cut-time.component.html',
  styleUrls: ['./modal-confirm-cut-time.component.scss']
})
export class ModalConfirmCutTimeComponent implements OnInit {
  @Input() dates;
  constructor(private modalInstance: NgbActiveModal) { }

  ngOnInit() {
  }

  confirm(status) {
    this.modalInstance.close(status)
  }

  dismiss() {
    this.modalInstance.dismiss()
  }

}
