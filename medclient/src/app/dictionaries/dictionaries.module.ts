import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DictionariesComponent } from './components/dictionaries/dictionaries.component';
import {DictionariesRoutingModule} from './dictionaries-routing.module';
import { DictionaryInfoComponent } from './components/dictionary-info/dictionary-info.component';
import { DictionaryItemComponent } from './components/dictionary-item/dictionary-item.component';
import {GridTableModule} from '../shared/grid-table/grid-table.module';
import {SimpleControlModule} from '../shared/simple-control/simple-control.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TreeTableModule} from 'primeng/primeng';

@NgModule({
  declarations: [DictionariesComponent, DictionaryInfoComponent, DictionaryItemComponent],
  imports: [
    CommonModule,
    DictionariesRoutingModule,
    GridTableModule,
    SimpleControlModule,
    FormsModule,
    ReactiveFormsModule,
    TreeTableModule
  ]
})
export class DictionariesModule { }
