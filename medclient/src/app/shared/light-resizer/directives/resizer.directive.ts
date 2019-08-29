import {Directive, ElementRef, Input} from '@angular/core';

@Directive({
  selector: '[resizer]'
})
export class ResizerDirective {
  @Input() resizer: string = '1px';

  constructor(public el: ElementRef) { }

}
