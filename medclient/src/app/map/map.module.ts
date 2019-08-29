import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './components/map/map.component';
import {MapRoutingModule} from './map-routing.module';
import {BestMapModule} from '../shared/best-map/best-map.module';

@NgModule({
  declarations: [MapComponent],
  imports: [
    CommonModule,
    MapRoutingModule,
    BestMapModule,
  ]
})
export class MapModule { }
