import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './components/map/map.component';
import {MapRoutingModule} from './map-routing.module';
import {BestMapModule} from '../shared/best-map/best-map.module';
import {LightResizerModule} from '../shared/light-resizer/light-resizer.module';
import {BigMapInfoService} from './services/big-map-info.service';

@NgModule({
  declarations: [MapComponent],
  imports: [
    CommonModule,
    MapRoutingModule,
    BestMapModule,
    LightResizerModule
  ],
  providers: [
    BigMapInfoService
  ]
})
export class MapModule { }
