import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BestMapComponent } from './components/best-map/best-map.component';
import { LayersService } from './services/layers.service';
import { MedMapComponent } from './components/med-map/med-map.component';
import { PopupComponent } from './components/popup/popup.component';
import { ManualCoordinatesComponent } from './components/manual-coordinates/manual-coordinates.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    BestMapComponent,
    MedMapComponent,
    PopupComponent,
    ManualCoordinatesComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    BestMapComponent,
    MedMapComponent,
    ManualCoordinatesComponent
  ],
  providers: [
    LayersService
  ],
  entryComponents: [
    PopupComponent
  ]

})
export class BestMapModule { }
