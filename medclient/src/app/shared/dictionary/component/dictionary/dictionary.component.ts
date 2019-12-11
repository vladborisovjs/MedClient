import {Component, EventEmitter, forwardRef, HostBinding, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {Observable, Subject, Subscription} from 'rxjs';
import {MedApi} from '../../../../../../swagger/med-api.service';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DictionaryComponent),
      multi: true
    }
  ]
})
export class DictionaryComponent implements OnInit {
  @Input() dict: string;
  @Input() bindLabel = 'label';
  @Input() bindValue = '';
  @Input() showCross = true;
  @Input() short = true;
  @Input() disabled = false;
  @Input() readonly: boolean = false;
  @Input() placeholder = '';
  @Input() filters: any = {};
  @Input() filtersOrder: string[] = [];
  @Input() dropdownPosition = 'auto';
  @Input() styleClass: string;
  @Input() searchField: string;
  @Input() addLabel: string;
  @Output() blur = new EventEmitter();
  @Output() dictSelect = new EventEmitter();
  @HostBinding('class') cls;

  @Input()
  set model(value) {
    this._value = value;
  }

  @Output() modelChange = new EventEmitter();

  source: Observable<any[]>;
  _value: any;

  from = 0;
  count = 50;
  scrollable = false;
  loading = false;
  subType = 0;
  title = '';
  sbscs: Subscription[] = [];
  searchUpdated: Subject<string> = new Subject<string>();


  list = [];


  constructor(private api: MedApi) {
    this.sbscs.push(
      this.searchUpdated.asObservable()
        .pipe(
          debounceTime(400)
        )
        .subscribe(
          s => {
            this.searching(s);
          }
        )
    );
  }

  private setList() {
    console.log(this.filters);
    if (!this.disabled && typeof this.api[`${this.dict}`] !== 'undefined') {
      let method = this.api[`${this.dict}`].bind(this.api);
      let orderedFilters = [];
      this.filtersOrder.forEach(el => {
        orderedFilters.push(this.filters[el]);
        console.log(el, '-->', this.filters[el]);
      });
      this.loading = true;
      if (this.short) {
        this.scrollable = false;
        method(...orderedFilters).toPromise().then(el => {
          this.list = el;
          this.loading = false;
        });
      } else {
        this.scrollable = true;
        method(this.from, this.count, false, ...orderedFilters).toPromise().then(el => {
          this.loading = false;
          this.list = el.list;
        });
      }
    }
  }

  onOpen() {
    this.resetDict();
    this.setList();
  }

  onClear(e) {
    this.resetDict();
    this.setList();
  }

  ngOnInit() {
    // this.setList(); // подгружаем варианты при открытии формы
    if (this._value) {
      this.title = this._value[this.bindLabel];
    }
    this.cls = `archive-dictionary ${this.styleClass ? this.styleClass : ''}`;
    if (!this.filters) {
      this.filters = {};
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.resetDict();
    }
  }

  ngOnDestroy() {
    this.sbscs.forEach(s => s.unsubscribe());
    this.sbscs = [];
  }

  onChange = (_: any) => {
  };
  onTouched = () => {
  };

  writeValue(value) {
    if (value !== undefined) {
      this._value = value;
    } else {
      this._value = null;
    }
  }

  resetDict() {
    delete this.filters[this.searchField];
    this.list = [];
    this.from = 0;
    this.count = 50;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
  }

  onSelectChange(e) {
    this.title = '';
    if (e) {
      this.title = e[this.bindLabel];
      if (this.bindValue) {
        if (e.hasOwnProperty(this.bindValue)) {
          this.onChange(e[this.bindValue]);
          this.modelChange.emit(e[this.bindValue]);
        } else {
          throw new Error(`Object does not have required field: ${this.bindValue}`);
        }
      } else {
        this.onChange(e);
        this.modelChange.emit(e);
      }
    } else {
      this.onChange(null);
      this.modelChange.emit(null);
    }
    this.dictSelect.emit(this._value);
  }

  onScrollToEnd(e) {
    if (!this.short) {
      if (this.scrollable) {
        let orderedFilters = [];
        this.filtersOrder.forEach(el => {
          orderedFilters.push(this.filters[el]);
        });
        this.from += 50;
        this.api[`${this.dict}`](this.from, this.count, false , ...orderedFilters).toPromise().then(el => {
          this.list = [...this.list, ...el.list];
          this.scrollable = (this.from + 50) < el.total;
        });
      }
    }
  }

  onBlur(e) {
    this.blur.emit(e);
    this.onTouched();
  }

  onSearch(e: string) {
    if (!this.short && this.searchField) {
      this.loading = true;
      this.searchUpdated.next(e);
    }
  }

  searching(text: string) {
    this.filters[this.searchField] = text;
    this.list = [];
    this.from = 0;
    this.count = 50;
    this.setList();
  }

}
