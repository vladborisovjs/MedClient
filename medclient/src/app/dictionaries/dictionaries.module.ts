import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DictionariesComponent } from './components/dictionaries/dictionaries.component';
import {DictionariesRoutingModule} from './dictionaries-routing.module';

@NgModule({
  declarations: [DictionariesComponent],
  imports: [
    CommonModule,
    DictionariesRoutingModule
  ]
})
export class DictionariesModule { }
