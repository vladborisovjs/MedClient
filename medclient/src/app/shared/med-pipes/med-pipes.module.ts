import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CallStatusPipe} from "./pipes/call-status.pipe";
import {OrderByPipe} from './pipes/order-by.pipe';
import { FullnameShorterPipe } from './pipes/fullname-shorter.pipe';
import { CardStatusPipe } from './pipes/card-status.pipe';

@NgModule({
  declarations: [CallStatusPipe, OrderByPipe, FullnameShorterPipe, CardStatusPipe],
  exports: [
    CallStatusPipe,
    OrderByPipe,
    FullnameShorterPipe,
    CardStatusPipe
  ],
  imports: [
    CommonModule
  ]
})
export class MedPipesModule { }
