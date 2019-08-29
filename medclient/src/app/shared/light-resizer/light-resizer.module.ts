import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BottomResizableDirective } from './directives/bottom-resizable.directive';
import { LeftResizableDirective } from './directives/left-resizable.directive';
import { ResizerDirective } from './directives/resizer.directive';
import { RightResizableDirective } from './directives/right-resizable.directive';
import { UpResizableDirective } from './directives/up-resizable.directive';
import { ResizableDirective } from './directives/resizable.directive';

@NgModule({
  declarations: [
    BottomResizableDirective,
    LeftResizableDirective,
    ResizerDirective,
    RightResizableDirective,
    UpResizableDirective,
    ResizableDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    BottomResizableDirective,
    LeftResizableDirective,
    ResizerDirective,
    RightResizableDirective,
    UpResizableDirective,
    ResizableDirective
  ]
})
export class LightResizerModule { }
