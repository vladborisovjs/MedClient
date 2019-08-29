import {Directive, ElementRef, Input} from '@angular/core';

@Directive({
  selector: '[upResizable]'
})
export class UpResizableDirective {
  @Input() fixed: string;

  constructor(public el: ElementRef) { }


}
