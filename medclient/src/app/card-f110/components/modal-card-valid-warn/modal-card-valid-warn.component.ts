import {Component, Input, OnInit} from '@angular/core';
import {CardBean, Status} from "../../../../../swagger/med-api.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-modal-card-valid-warn',
  templateUrl: './modal-card-valid-warn.component.html',

  styleUrls: ['./modal-card-valid-warn.component.scss']
})
export class ModalCardValidWarnComponent implements OnInit {
@Input() cardItem: CardBean;
@Input() status: Status;

  cardStatuses = Status;
  constructor(private modalInstance: NgbActiveModal) { }

  ngOnInit() {
    console.log(this.cardItem);
  }

  back(){
    this.modalInstance.dismiss()
  }

  submit(){
    this.modalInstance.close({type: 'submit', val: true});
  }

  closeAndNavigate(path: string){
    this.modalInstance.close({type: 'navigate', val: path});
  }

}
