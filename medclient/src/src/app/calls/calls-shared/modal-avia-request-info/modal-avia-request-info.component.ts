import {Component, Input, OnInit} from '@angular/core';
import {AviaRequestBean} from '../../../../../swagger/med-api.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-avia-request-info',
  templateUrl: './modal-avia-request-info.component.html',
  styleUrls: ['./modal-avia-request-info.component.scss']
})
export class ModalAviaRequestInfoComponent implements OnInit {
@Input() reqItem: AviaRequestBean;

  constructor(private modalInstance: NgbActiveModal) { }

  ngOnInit() {
  }

back(){
    this.modalInstance.dismiss();
}

}
