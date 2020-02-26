import { Injectable } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmComponent} from '../components/confirm/confirm.component';

@Injectable({
  providedIn: 'root'
})
export class CustomModalService {

  constructor(private modal: NgbModal) { }

  confirm(title, content){
    const confirmWindow = this.modal.open(ConfirmComponent);
    confirmWindow.componentInstance.title = title;
    confirmWindow.componentInstance.content = content;
    return confirmWindow.result;
  }
}
