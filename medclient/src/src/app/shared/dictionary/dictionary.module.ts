import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DictionaryComponent } from './component/dictionary/dictionary.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MedApi} from '../../../../swagger/med-api.service';

@NgModule({
  declarations: [DictionaryComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbModule
  ],
  providers: [
    MedApi
  ],
  exports: [
    DictionaryComponent
  ]

})
export class DictionaryModule { }
