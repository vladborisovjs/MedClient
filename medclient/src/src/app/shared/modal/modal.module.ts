import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmComponent } from './components/confirm/confirm.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CustomModalService} from './services/custom-modal.service';

@NgModule({
  declarations: [ConfirmComponent],
  imports: [
    CommonModule,
    NgbModule,
  ],
  providers: [
    CustomModalService
  ],
  entryComponents: [
    ConfirmComponent
  ]
})
export class ModalModule { }
