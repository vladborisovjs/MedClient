import {Component, ElementRef, EventEmitter, forwardRef, HostBinding, Input, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-simple-control',
  templateUrl: './simple-control.component.html',
  styleUrls: ['./simple-control.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(
      () => SimpleControlComponent), multi: true
  }]
})
export class SimpleControlComponent implements OnInit, ControlValueAccessor {
  @Input() type: string;
  @Input() label: string;
  @Input() labelKey: string;
  @Input() formControlName: string;
  @Input() errorText: string;
  @Input() isError: boolean = false;
  @Input() placeholder = '';
  @Input() rows = 2;
  @Input() dict;
  @Input() dictFilters: any = {};
  @Input() dictFiltersOrder: any = [];
  @Input() dictSearchField = 'name';
  @Input() bindValue = '';
  @Input() bindLabel = 'name';
  @Input() dateFormat = 'dd.mm.yy';
  @Input() shortDict = false;
  @Input() styleClass = '';
  @Input() additional: any;
  @Input() alwaysDisabled = false;
  @Input() dropdownPosition;
  @Input() templateField = 'name';
  @Input() selectList: any[];
  @Output() dictSelect = new EventEmitter();
  @HostBinding('class') hostClass;
  @ViewChild('ctrl', { read: ElementRef }) ctrl: ElementRef;

  _value: any;
  get value(): any {
    return this._value;
  }

  set value(v: any) {
    this._value = v;
    this.onModelChange(v);
  }

  ru = {
    firstDayOfWeek: 1,
    dayNames: ['Воскресение', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
    dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    monthNamesShort: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    today: 'Сегодня',
    clear: 'Очистить'
  };
  disabled = false;

  public onModelChange: any = () => {
  };
  public onModelTouched: Function = () => {
  };

  registerOnChange(fn: any): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onModelTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInputBlur(event) {
    this.onModelTouched();
  }

  writeValue(obj: any): void {
    if (obj !== undefined) {
      this._value = obj;
    }
  }

  constructor(private renderer: Renderer2) {
  }

  ngOnInit() {
    this.hostClass = `sc ${this.styleClass}`;
    this.dropdownPosition = this.dropdownPosition ? this.dropdownPosition : 'auto';
  }

  onDictSelect(e){
    this.dictSelect.emit({
      item: e,
      key: this.formControlName
    });
  }
}
