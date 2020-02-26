import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-modal-ukio-incoming',
  templateUrl: './modal-ukio-incoming.component.html',
  styleUrls: ['./modal-ukio-incoming.component.scss']
})
export class ModalUkioIncomingComponent implements OnInit {
@Input() ukioItem: {callId: number, declarantPhone: number|string, ukioId: number|string};
  // callId: 453739
  // declarantPhone: "89214563323"
  // ukioId: "99347"
  constructor(private modalInstance: NgbActiveModal) { }

  ngOnInit() {
  }

  acceptCall(){
    this.modalInstance.close(true);
  }

  back(){
    this.modalInstance.dismiss();
  }

}
