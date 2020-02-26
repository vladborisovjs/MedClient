import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-modal-brigade-overdue',
  templateUrl: './modal-brigade-overdue.component.html',
  styleUrls: ['./modal-brigade-overdue.component.scss']
})
export class ModalBrigadeOverdueComponent implements OnInit {

  constructor(private modalInstance: NgbActiveModal) { }

  ngOnInit() {
  }

  back(){
    this.modalInstance.dismiss();
  }

  go2close(){
    this.modalInstance.close(true);
  }
}
