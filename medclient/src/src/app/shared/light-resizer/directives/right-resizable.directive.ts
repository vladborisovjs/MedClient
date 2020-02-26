import {Directive, ElementRef, Input} from '@angular/core';

@Directive({
  selector: '[rightResizable]'
})
export class RightResizableDirective {
  @Input() fixed: string;

  constructor(public el: ElementRef) { }


}
