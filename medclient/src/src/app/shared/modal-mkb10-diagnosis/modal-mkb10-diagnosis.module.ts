import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModalMkb10DiagnosisComponent} from './components/modal-mkb10-diagnosis.component';
import {SimpleControlModule} from '../simple-control/simple-control.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {TreeTableModule} from 'primeng/primeng';

@NgModule({
  declarations: [ModalMkb10DiagnosisComponent],
  imports: [
    CommonModule,
    SimpleControlModule,
    FormsModule,
    ReactiveFormsModule,
    TreeTableModule,
    NgSelectModule,
  ],
  exports: [
    ModalMkb10DiagnosisComponent,
  ],
  entryComponents: [
    ModalMkb10DiagnosisComponent
  ]
})
export class ModalMkb10DiagnosisModule { }
