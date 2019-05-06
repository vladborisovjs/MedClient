import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ISimpleDescription, SimpleDescriptionService} from '../../services/simple-description.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-simple-view',
  templateUrl: './simple-view.component.html',
  styleUrls: ['./simple-view.component.scss']
})
export class SimpleViewComponent implements OnInit, OnChanges, OnDestroy, AfterViewChecked {
  @Input() item: any = {};
  @Input() form: FormGroup;
  @Input() descriptions: ISimpleDescription[];
  @Input() styleClass: string;
  @Input() formStyle: string;
  @Input() preprocessed = false;
  @Input() row = false;
  @Input() rows = 2;
  @Input() noGutters = true;
  @Input() sort = false;
  @HostBinding('class') cls;

  showDescs: ISimpleDescription[] = [];
  sbscs: Subscription[] = [];

  // necessary fields for unlocking ctrls
  necParents: string[];
  // descriptions of dependent ctrls
  depDescs: ISimpleDescription[];

  constructor(private sd: SimpleDescriptionService, private cdRef: ChangeDetectorRef) {
  }

  // массивы для методов блокировки (см ниже)
  createNecessaryDescs() {
    this.depDescs = this.descriptions.filter(desc => {
      return !!desc.necessary;
    });

    this.necParents = [];
    // generate array of necessary fields for watching
    this.depDescs.forEach(desc => {
      if (desc.necessary) {
        this.necParents.push(...desc.necessary.map(el => el.key));
      }
    });
    this.necParents = this.necParents.filter((item, pos) => {
      return this.necParents.indexOf(item) === pos;
    });
  }

  watchLock() {
    this.necParents.forEach(el => {
      let ctrl = this.form.get(el);
      if (ctrl) {
        this.sbscs.push(
          ctrl.valueChanges.subscribe(
            v => {
              let descs = this.depDescs.filter(dd => {
                let yep = false;
                dd.necessary.forEach(n => {
                  if (n.key === el) {
                    yep = true;
                  }
                });
                return yep;
              });
              descs.forEach(d => {
                this.checkLock(d);
              });
            }
          )
        );
      }
    });
  }

  // Заблокировать - разблокировать поле зависимых контролов
  checkLock(desc, reset = true) {
    // нужно только для зависимых справочников (и шаблонов)
    this.setDependedFilters(desc);

    let unlock = true;
    desc.necessary.forEach(d => {
      if (!this.form.get(d.key).value) {
        unlock = false;
      }
    });
    const ctrl = this.form.get(desc.key);
    if (reset) {
      ctrl.reset(null);
    }
    if (unlock) {
      if (ctrl.disabled && this.form.enabled) {
        ctrl.enable({emitEvent: false});
      }
    } else {
      if (ctrl.enabled) {
        ctrl.disable({emitEvent: false});
      }
    }
  }

  /**
   * Выставить фильтры по описанию для зависимого от других контролов справочника
   * @param desc - описание такого справочника (по полю несессари)
   *
   * если в элементе массива necessary встречается subField, это указывает на то, что
   * родительский necessary влияет на фильтр данного справочника
   *
   * если в necessary есть selectList то берем эту функцию и вставляем в её аргумент
   * поле из родителя, указанное в funcParam, если надо
   */
  setDependedFilters(desc) {
    desc.necessary.forEach(d => {
      const val = this.form.get(d.key).value;
      if (d.selectList) {
        if (val) {
          if (d.funcParam) {
            desc.selectList = d.selectList(val[d.funcParam]);
          } else {
            desc.selectList = d.selectList(val);
          }
        }
      }
      if (d.subField) {
        desc.dictFilters = desc.dictFilters ? desc.dictFilters : {};
        if (val) {
          if (d.keyField) {
            desc.dictFilters[d.subField] = val[d.keyField] ? val[d.keyField] : null;
          } else {
            desc.dictFilters[d.subField] = val;
          }
        } else {
          delete desc.dictFilters[d.subField];
        }
      }
    });
  }

  getFormClass(cl: string) {
    return cl ? `sv-control ${cl}` : `sv-control`;
  }

  ngOnInit() {
    this.formStyle = `sv-container${this.formStyle ? ' ' + this.formStyle : ''}
    ${this.row ? ' row' : ''}${this.noGutters ? ' no-gutters' : ''}`;
    this.cls = `sv-host${this.styleClass ? ' ' + this.styleClass : ''}`;
    if (this.row) {
      this.descriptions.forEach(el => {
        if (!el.styleClass) {
          el.styleClass = 'col-12';
        }
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.descriptions || changes.item) {
      this.updateView();
    }
  }

  ngOnDestroy(): void {
    this.unsubscriber();
  }


  unsubscriber(): void {
    this.sbscs.forEach(sb => {
      sb.unsubscribe();
    });
    this.sbscs = [];
  }

  updateView() {
    this.unsubscriber();
    if (this.form) {
      if (!this.preprocessed) {
        this.sd.makeForm(this.descriptions, this.form, this.sort);
      }
    } else {
      this.form = this.sd.makeForm(this.descriptions, undefined, this.sort);
    }
    this.showDescs = this.descriptions.filter(el => !el.hide);
    if (!this.preprocessed) {
      this.form.reset(this.item);
    }

    this.createNecessaryDescs();

    // предварительный чек лок, без ресета значения
    this.depDescs.forEach(el => {
      this.checkLock(el, false);
    });
    //this.checkLock(false);
    this.watchLock();
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }
}
