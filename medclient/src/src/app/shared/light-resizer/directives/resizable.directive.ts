/**
 * for success using you should mark DOM element as flex (with right direction) by directive resizable
 * assign it by value "horizontal" or "vertical"
 * mark direct childs as 'leftResizable' and 'rightResizable' or 'upResizable' and 'bottomResizable'
 * all childs elements should have min-height or min-width
 * one of child elements should have parameter 'fixed' equal to choosing size (e.g. 282px)
 * between of child elements place element marked by directive 'resizer' - the size will change if you pull that element
 * determine 'resizer' by the number that indicate displaying 'resizer' HALF size
 *
 * Example:
 *
 *
 <div style="display: flex" resizable="horizontal" (onResize)="resize($event)">
 <div class="inv-objects-list left-resizable" leftResizable>
 smthng
 </div>
 <div class="vertical-resizer" resizer="2px"></div>
 <div class="inv-filters right-resizable" rightResizable fixed="400px">
 smthng2
 </div>
 </div>

 .vertical-resizer {
    width: 8px;
    padding: 0 2px;
    margin-left: -2px;
    margin-right: -2px;
    z-index: 4;
    &::after{
      content: " ";
      display: block;
      width: 4px; // size of visible part or resizer = 4px ==>> resizer="2px"
      background-color: $gray-600;
      height: 100%;
    }
  }
 */

import {ContentChildren, Directive, ElementRef, EventEmitter, Input, Output, QueryList, Renderer2} from '@angular/core';
import {ResizerDirective} from './resizer.directive';
import {UpResizableDirective} from './up-resizable.directive';
import {BottomResizableDirective} from './bottom-resizable.directive';
import {LeftResizableDirective} from './left-resizable.directive';
import {fromEvent, interval, Subscription} from 'rxjs';
import {RightResizableDirective} from './right-resizable.directive';
import {throttle} from 'rxjs/operators';

@Directive({
  selector: '[resizable]'
})
export class ResizableDirective {
  @Input('resizable') direction = 'horizontal';
  @Input() saveName: string;
  @Output() onResize = new EventEmitter();

  @ContentChildren(ResizerDirective, {descendants: false}) resizer: QueryList<ResizerDirective>;
  private grabbing = false;
  private mD: Subscription;
  private mM: Subscription;
  private mU: Subscription;
  private selection: Subscription;

  @ContentChildren(LeftResizableDirective, {descendants: false}) lrd: QueryList<LeftResizableDirective>;
  @ContentChildren(RightResizableDirective, {descendants: false}) rrd: QueryList<RightResizableDirective>;
  private leftResizable: any;
  private rightResizable: any;
  private verticalResizer: any;
  private lX: any;
  private rX: any;
  private currentLF: any;
  private currentRF: any;
  private defaultX: number;

  @ContentChildren(UpResizableDirective, {descendants: false}) urd: QueryList<UpResizableDirective>;
  @ContentChildren(BottomResizableDirective, {descendants: false}) brd: QueryList<BottomResizableDirective>;
  private upResizable: any;
  private bottomResizable: any;
  private horizontalResizer: any;
  private uY: any;
  private bY: any;
  private currentBF: any;
  private currentUF: any;
  private defaultY: number;

  private body = document.body;

  constructor(private el: ElementRef, private renderer2: Renderer2) {
  }

  ngAfterContentInit() {
    if (this.direction === 'vertical') {
      this.horizontalResizer = this.resizer.first.el.nativeElement;
      this.upResizable = this.urd.first.el.nativeElement;
      this.bottomResizable = this.brd.first.el.nativeElement;

      let defaultResizerHeight = this.resizer.first.resizer;

      let minUpHeight = parseInt(window.getComputedStyle(this.upResizable).minHeight.match(/\d+/)[0], 10);
      let minBottomHeight = parseInt(window.getComputedStyle(this.bottomResizable).minHeight.match(/\d+/)[0], 10);
      let currentUp: number;
      let currentBottom: number;

      let bf: string;
      let uf: string;
      if (this.brd.first.fixed) {
        let tempBottomF: any;
        if (this.saveName) {
          tempBottomF = localStorage.getItem(`${this.saveName}.bot`);
        }
        if (tempBottomF) {
          bf = tempBottomF;
        } else {
          bf = this.brd.first.fixed;
        }
      } else {
        let tempUpF: any;
        if (this.saveName) {
          tempUpF = localStorage.getItem(`${this.saveName}.up`);
        }
        if (tempUpF) {
          bf = tempUpF;
        }
        uf = this.urd.first.fixed;
      }
      if (bf) {
        this.renderer2.setStyle(this.bottomResizable, 'flex', `0 0`);
        this.renderer2.setStyle(this.bottomResizable, 'flex-basis', `calc(${bf} - ${defaultResizerHeight})`);
        this.renderer2.setStyle(this.upResizable, 'flex-basis', `100%`);
      } else {
        this.renderer2.setStyle(this.upResizable, 'flex', `0 0`);
        this.renderer2.setStyle(this.upResizable, 'flex-basis', `calc(${uf} - ${defaultResizerHeight})`);
        this.renderer2.setStyle(this.bottomResizable, 'flex-basis', `100%`);
      }

      this.renderer2.setStyle(this.horizontalResizer, 'cursor', 'ns-resize');

      this.mD = fromEvent(this.horizontalResizer, 'mousedown')
        .subscribe((event: MouseEvent) => {
          this.renderer2.setStyle(this.body, 'cursor', `ns-resize`);
          this.renderer2.setStyle(this.body, 'user-select', `none`);
          this.defaultY = event.y;
          this.uY = window.getComputedStyle(this.upResizable).flexBasis;
          this.bY = window.getComputedStyle(this.bottomResizable).flexBasis;
          this.grabbing = true;
          currentUp = parseInt(window.getComputedStyle(this.upResizable).height.match(/\d+/)[0], 10);
          currentBottom = parseInt(window.getComputedStyle(this.bottomResizable).height.match(/\d+/)[0], 10);
        });

      this.mM = fromEvent(window, 'mousemove')
        .pipe(
          throttle(() => interval(13))
        )
        .subscribe((event: MouseEvent) => {
          if (this.grabbing && event.y) {
            if ((currentUp + event.y - this.defaultY) > (minUpHeight - 1)
              && (currentBottom - event.y + this.defaultY) > (minBottomHeight - 1)) {
              if (bf) {
                this.currentBF = `calc(${this.bY} - ${event.y - this.defaultY}px)`;
                this.renderer2.setStyle(this.bottomResizable, 'flex-basis', this.currentBF);
              }
              if (uf) {
                this.currentUF = `calc(${this.uY} + ${event.y - this.defaultY}px)`;
                this.renderer2.setStyle(this.upResizable, 'flex-basis', this.currentUF);
              }
              this.onResize.emit(event);
            }
          }
        });

      this.mU = fromEvent(window, 'mouseup')
        .subscribe((event: MouseEvent) => {
          if (this.grabbing) {
            this.grabbing = false;
          }
          if (this.saveName && this.currentBF) {
            localStorage.setItem(`${this.saveName}.bot`, this.currentBF);
          }
          if (this.saveName && this.currentUF) {
            localStorage.setItem(`${this.saveName}.up`, this.currentUF);
          }
          this.renderer2.removeStyle(this.body, 'cursor');
          this.renderer2.removeStyle(this.body, 'user-select');
        });
    } else {
      this.verticalResizer = this.resizer.first.el.nativeElement;
      this.leftResizable = this.lrd.first.el.nativeElement;
      this.rightResizable = this.rrd.first.el.nativeElement;

      let defaultResizerWidth = this.resizer.first.resizer;

      let minLeftWidth = parseInt(window.getComputedStyle(this.leftResizable).minWidth.match(/\d+/)[0], 10);
      let minRightWidth = parseInt(window.getComputedStyle(this.rightResizable).minWidth.match(/\d+/)[0], 10);
      let currentLeft: number;
      let currentRight: number;

      let lf: string;
      let rf: string;
      if (this.lrd.first.fixed) {
        let tempLeftF: any;
        if (this.saveName) {
          tempLeftF = localStorage.getItem(`${this.saveName}.left`);
        }
        if (tempLeftF) {
          lf = tempLeftF;
        } else {
          lf = this.lrd.first.fixed;
        }
      } else {
        let tempRightF: any;
        if (this.saveName) {
          tempRightF = localStorage.getItem(`${this.saveName}.right`);
        }
        if (tempRightF) {
          rf = tempRightF;
        } else {
          rf = this.rrd.first.fixed;
        }
      }

      if (lf) {
        this.renderer2.setStyle(this.leftResizable, 'flex', `0 0`);
        this.renderer2.setStyle(this.leftResizable, 'flex-basis', `calc(${lf} - ${defaultResizerWidth})`);
        this.renderer2.setStyle(this.rightResizable, 'flex-basis', `100%`);
      } else {
        this.renderer2.setStyle(this.rightResizable, 'flex', `0 0`);
        this.renderer2.setStyle(this.rightResizable, 'flex-basis', `calc(${rf} - ${defaultResizerWidth})`);
        this.renderer2.setStyle(this.leftResizable, 'flex-basis', `100%`);
      }

      this.renderer2.setStyle(this.verticalResizer, 'cursor', 'ew-resize');

      this.mD = fromEvent(this.verticalResizer, 'mousedown')
        .subscribe((event: MouseEvent) => {
          this.renderer2.setStyle(this.body, 'cursor', `ew-resize`);
          this.renderer2.setStyle(this.body, 'user-select', `none`);
          this.defaultX = event.x;
          this.lX = window.getComputedStyle(this.leftResizable).flexBasis;
          this.rX = window.getComputedStyle(this.rightResizable).flexBasis;
          this.grabbing = true;
          currentLeft = parseInt(window.getComputedStyle(this.leftResizable).width.match(/\d+/)[0], 10);
          currentRight = parseInt(window.getComputedStyle(this.rightResizable).width.match(/\d+/)[0], 10);
        });

      this.mM = fromEvent(window, 'mousemove')
        .pipe(
          throttle(() => interval(13))
        )
        .subscribe((event: MouseEvent) => {
          if (this.grabbing && event.x) {
            if ((currentLeft + event.x - this.defaultX) > minLeftWidth && (currentRight - event.x + this.defaultX) > minRightWidth) {
              if (lf) {
                this.currentLF = `calc(${this.lX} + ${event.x - this.defaultX}px)`;
                this.renderer2.setStyle(this.leftResizable, 'flex-basis', this.currentLF);
              }
              if (rf) {
                this.currentRF = `calc(${this.rX} - ${event.x - this.defaultX}px)`;
                this.renderer2.setStyle(this.rightResizable, 'flex-basis', this.currentRF);
              }
              this.onResize.emit(event);
            }
          }
        });

      this.mU = fromEvent(window, 'mouseup')
        .subscribe((event: MouseEvent) => {
          if (this.grabbing) {
            this.grabbing = false;
          }
          if (this.saveName && this.currentLF) {
            localStorage.setItem(`${this.saveName}.left`, this.currentLF);
          }
          if (this.saveName && this.currentRF) {
            localStorage.setItem(`${this.saveName}.right`, this.currentRF);
          }
          this.renderer2.removeStyle(this.body, 'cursor');
          this.renderer2.removeStyle(this.body, 'user-select');
        });
    }
    this.selection = fromEvent(window, 'selectstart')
      .subscribe((event: Event) => {
        if (this.grabbing) {
          event.preventDefault();
        }
      });
  }

  ngOnDestroy() {
    this.mD.unsubscribe();
    this.mM.unsubscribe();
    this.mU.unsubscribe();
    this.selection.unsubscribe();
  }

}
