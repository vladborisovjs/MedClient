import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BestMapComponent } from './components/best-map/best-map.component';
import { LayersService } from './services/layers.service';
import { MedMapComponent } from './components/med-map/med-map.component';
import { PopupComponent } from './components/popup/popup.component';

@NgModule({
  declarations: [
    BestMapComponent,
    MedMapComponent,
    PopupComponent],
  imports: [
    CommonModule
  ],
  exports: [
    BestMapComponent,
    MedMapComponent
  ],
  providers: [
    LayersService
  ],
  entryComponents: [
    PopupComponent
  ]

})
export class BestMapModule { }
