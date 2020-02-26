import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullAddressComponent } from './components/full-address/full-address.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FullAddressFiasComponent } from './components/full-address-fias/full-address-fias.component';

@NgModule({
  declarations: [FullAddressComponent, FullAddressFiasComponent],
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [FullAddressComponent, FullAddressFiasComponent],
})
export class FullAddressModule { }
