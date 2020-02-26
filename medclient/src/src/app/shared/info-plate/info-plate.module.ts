import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoPlateComponent } from './components/info-plate/info-plate.component';

@NgModule({
  declarations: [InfoPlateComponent],
  imports: [
    CommonModule
  ],
  exports: [
    InfoPlateComponent
  ]
})
export class InfoPlateModule { }
