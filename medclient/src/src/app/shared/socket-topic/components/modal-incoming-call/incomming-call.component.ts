import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-incomming-call',
  templateUrl: './incomming-call.component.html',
  styleUrls: ['./incomming-call.component.scss']
})
export class IncommingCallComponent implements OnInit {
@Input() callItem: {performerId: number, sessionId: string, fromNumber: string, ukio: any};
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
