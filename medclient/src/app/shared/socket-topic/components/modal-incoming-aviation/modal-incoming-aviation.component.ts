import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-modal-incoming-aviation',
  templateUrl: './modal-incoming-aviation.component.html',
  styleUrls: ['./modal-incoming-aviation.component.scss']
})
export class ModalIncomingAviationComponent implements OnInit {

  constructor(private modalInstance: NgbActiveModal) { }

  ngOnInit() {
  }

  gotoRequests(){
    this.modalInstance.close(true);
  }

  back(){
    this.modalInstance.dismiss();
  }

}
