import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AviationRoutingModule} from './aviation-routing.module';
import {AviationComponent} from './components/aviation/aviation.component';
import {NavigationModule} from '../navigation/navigation.module';
import { AviaRequetsComponent } from './components/avia-requets/avia-requets.component';

@NgModule({
  declarations: [AviationComponent, AviaRequetsComponent],
  imports: [
    CommonModule,
    AviationRoutingModule,
    NavigationModule
  ]
})
export class AviationModule {
}
