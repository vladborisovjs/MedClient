import {Directive, ElementRef, Input} from '@angular/core';

@Directive({
  selector: '[bottomResizable]'
})
export class BottomResizableDirective {
  @Input() fixed: string;

  constructor(public el: ElementRef) { }

}
