import {Directive, ElementRef, Input} from '@angular/core';

@Directive({
  selector: '[leftResizable]'
})
export class LeftResizableDirective {
  @Input() fixed: string;

  constructor(public el: ElementRef) { }

}
