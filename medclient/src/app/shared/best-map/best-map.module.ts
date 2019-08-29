import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BestMapComponent } from './components/best-map/best-map.component';
import { LayersService } from './services/layers.service';

@NgModule({
  declarations: [BestMapComponent],
  imports: [
    CommonModule
  ],
  exports: [
    BestMapComponent
  ],
  providers: [
    LayersService
  ]
})
export class BestMapModule { }
