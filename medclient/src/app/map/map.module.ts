import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './components/map/map.component';
import {MapRoutingModule} from './map-routing.module';
import {BestMapModule} from '../shared/best-map/best-map.module';
import {LightResizerModule} from '../shared/light-resizer/light-resizer.module';
import {BigMapInfoService} from './services/big-map-info.service';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  declarations: [MapComponent],
  imports: [
    CommonModule,
    MapRoutingModule,
    BestMapModule,
    LightResizerModule,
    NgbModule
  ],
  providers: [
    BigMapInfoService
  ]
})
export class MapModule { }
