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
  docCheck = true;
  constructor(private modalInstance: NgbActiveModal) { }

  ngOnInit() {
    console.log(this.cardItem);
    if (this.cardItem && this.cardItem.patientFK &&  this.cardItem.patientFK.documentList){
      this.cardItem.patientFK.documentList.forEach(
        doc => {
          if (!doc.typeFK){
            this.docCheck = false
          }
        }
      );
    }
  }

  back(){
    this.modalInstance.dismiss()
  }

  submit(){
    this.modalInstance.close({type: 'submit', val: true});
  }

  checkBirthDay(bDay: Date) {
    let today = new Date();
    return  (today.getFullYear() - bDay.getFullYear()) < 120 && (bDay < today);
  }

  closeAndNavigate(path: string){
    this.modalInstance.close({type: 'navigate', val: path});
  }

}
