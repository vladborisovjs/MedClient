import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullAddressComponent } from './components/full-address/full-address.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [FullAddressComponent],
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [FullAddressComponent],
})
export class FullAddressModule { }
