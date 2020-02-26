import {Injectable} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {interval, Subscription} from 'rxjs';
import {debounce} from 'rxjs/internal/operators';
import {ISimpleDescription} from './simple-description.service';
import {cloneDeep} from 'lodash';

export interface IProduct {
  target: string;
  sources: string[];
}

export interface ISum {
  target: string;
  sources: string[];
}

export interface IDifference {
  target: string;
  fieldFrom: string;
  fieldThis: string;
}

export interface IConditionShow {
  target: string;
  equalityCondition: any[];
  comparedField?: string;
  show: string[];
}

export interface ICopying {
  source: string;
  targets: string[];
}


@Injectable()
export class SimpleFormsToolsService {

  fieldExist(obj: any, way: string): boolean {
    const mas = way.split('.');
    let el = obj;
    for (let i = 0; i < mas.length; i++) {
      if (el && el.hasOwnProperty(mas[i])) {
        el = el[mas[i]];
      } else {
        return false;
      }
    }
    return true;
  }

  getValueByWay(obj: any, way: string) {
    const mas = way.split('.');
    let el = obj;
    mas.forEach(s => {
      el = el[s];
    });
    return cloneDeep(el);
  }

  /**
   * трогает все контролы формы
   * @param {FormGroup} form
   */
  markAllControlsAsTouched(form: FormGroup) {
    for (const i in form.controls) {
      if (form.controls.hasOwnProperty(i)) {
        form.get(i).markAsTouched();
      }
    }
  }

  /** сумматор - ссумирование
   *
   * @param {FormGroup} form
   * @param {ISum} p
   */
  private sumator(form: FormGroup, p: ISum): void {
    const ctrlTarget = form.get(p.target);
    if (!ctrlTarget) {
      return;
    }
    let sum = null;
    p.sources.forEach(s => {
      const tempCtrl = form.get(s);
      if (tempCtrl) {
        let val = parseFloat(tempCtrl.value);
        if (!isNaN(val)) {
          if (sum === null) {
            sum = val;
          } else {
            sum += parseFloat(tempCtrl.value);
          }
        }
      }
    });
    if (sum === null) {
      ctrlTarget.setValue(null);
    } else {
      ctrlTarget.setValue((Math.round(sum * 100) / 100));
    }
  }

  /**
   * сумматор - слежение за формой
   * @param {FormGroup} form
   * @param {ISum[]} sum
   * @returns {Subscription[]}
   */
  sumWatcher(form: FormGroup, sum: ISum[]): Subscription[] {
    let sbscs: Subscription[] = [];
    sum.forEach(el => {
      el.sources.forEach(sr => {
        const ctrl = form.get(sr);
        if (ctrl) {
          sbscs.push(
            ctrl.valueChanges.pipe(
              debounce(() => interval(300))
            ).subscribe(s => {
              this.sumator(form, el);
            })
          );
        }
      });
    });
    return sbscs;
  }

  /** вычитатель - вычитание
   *
   * @param {FormGroup} form
   * @param d
   */
  private differencer(form: FormGroup, d: IDifference) {
    const ctrlTarget = form.get(d.target);
    if (!ctrlTarget) {
      return;
    }
    let res = ctrlTarget.value;
    const fr = form.get(d.fieldFrom);
    const th = form.get(d.fieldThis);
    if (fr && fr.value) {
      res = fr.value;
      if (th && th.value) {
        res -= th.value;
      }
    }
    ctrlTarget.setValue((Math.round(res * 100) / 100));
  }

  /**
   *  вычитатель - слежение за формой
   * @param {FormGroup} form
   * @param {IDifference[]} diff
   * @returns {Subscription[]}
   */
  differenceWatcher(form: FormGroup, diff: IDifference[]): Subscription[] {
    let sbscs: Subscription[] = [];
    diff.forEach(el => {
      const ctrlF = form.get(el.fieldFrom);
      if (ctrlF) {
        sbscs.push(
          ctrlF.valueChanges.pipe(
            debounce(() => interval(300))
          ).subscribe(s => {
            this.differencer(form, el);
          })
        );
      }
      const ctrlT = form.get(el.fieldThis);
      if (ctrlT) {
        sbscs.push(
          ctrlT.valueChanges.pipe(
            debounce(() => interval(300))
          ).subscribe(s => {
            this.differencer(form, el);
          })
        );
      }
    });
    return sbscs;
  }

  /** умножатор - умножение
   *
   * @param {FormGroup} form
   * @param {IProduct} p
   */
  private product(form: FormGroup, p: IProduct) {
    const ctrlTarget = form.get(p.target);
    if (!ctrlTarget) {
      return;
    }
    let sum = null;
    let nan = false;
    p.sources.forEach(s => {
      const tempCtrl = form.get(s);
      if (tempCtrl) {
        let val = parseFloat(tempCtrl.value);
        if (!isNaN(val)) {
          if (sum === null) {
            sum = val;
          } else {
            sum *= parseFloat(tempCtrl.value);
          }
        } else {
          nan = true;
        }
      }
    });
    if (nan) {
      ctrlTarget.setValue(null);
    } else {
      ctrlTarget.setValue((Math.round(sum * 100) / 100));
    }
  }

  /**
   * умножатор - слежение за формой
   * @param {FormGroup} form
   * @param {IProduct[]} prod
   * @returns {Subscription[]}
   */
  productWatcher(form: FormGroup, prod: IProduct[]): Subscription[] {
    let sbscs: Subscription[] = [];
    prod.forEach(el => {
      el.sources.forEach(sr => {
        const ctrl = form.get(sr);
        if (ctrl) {
          sbscs.push(
            ctrl.valueChanges.pipe(
              debounce(() => interval(300))
            ).subscribe(s => {
              this.product(form, el);
            })
          );
        }
      });
    });
    return sbscs;
  }

  watchConditionShow(form: FormGroup, condShow: IConditionShow[], descriptions: ISimpleDescription[]): Subscription[] {
    let sbscs: Subscription[] = [];

    let showsHiddingTo = (c: IConditionShow, val: boolean) => {
      c.show.forEach(h => {
        let desc = descriptions.find(el => el.key === h);
        if (desc) {
          desc.hide = val;
        }
      });
    };

    let equalityConditionExecuted = (val: any, mas: any[]): boolean => {
      for (let i = 0; i < mas.length; i++) {
        if (val === mas[i]) {
          return true;
        }
      }
      return false;
    };

    condShow.forEach(c => {
      const ctrl = form.get(c.target);
      if (ctrl) {
        if (c.comparedField) {
          if (this.fieldExist(ctrl.value, c.comparedField)) {
            let val = this.getValueByWay(ctrl.value, c.comparedField);
            showsHiddingTo(c, !equalityConditionExecuted(val, c.equalityCondition));
          } else {
            showsHiddingTo(c, true);
          }
        } else {
          showsHiddingTo(c, !equalityConditionExecuted(ctrl.value, c.equalityCondition));
        }
        sbscs.push(
          ctrl.valueChanges.subscribe(val => {
            if (c.comparedField) {
              if (this.fieldExist(val, c.comparedField)) {
                let valg = this.getValueByWay(val, c.comparedField);
                showsHiddingTo(c, !equalityConditionExecuted(valg, c.equalityCondition));
              } else {
                showsHiddingTo(c, true);
              }
            } else {
              showsHiddingTo(c, !equalityConditionExecuted(val, c.equalityCondition));
            }
          })
        );
      }
    });
    return sbscs;
  }

  watchCopying(form: FormGroup, cop: ICopying[]): Subscription[] {
    let sbscs: Subscription[] = [];
    cop.forEach(co => {
      let ctrl = form.get(co.source);
      if (ctrl) {
        sbscs.push(
          ctrl.valueChanges.pipe(
            debounce(() => interval(300))
          ).subscribe(val => {
            if (val !== null && val !== '') {
              co.targets.forEach(s => {
                let sCtrl = form.get(s);
                if (sCtrl) {
                  sCtrl.setValue(val);
                }
              });
            }
          })
        );
      }
    });
    return sbscs;
  }
  constructor() {
  }
}
