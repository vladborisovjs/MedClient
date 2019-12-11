import {Injectable} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {debounceTime} from "rxjs/operators";


export interface IConditions {
  lower?: {
    first: string,
    second: string
  },
  diff?: {
    first: string,
    second: string,
    result: string,
  },
  diff_time?: {
    first: string,
    second: string,
    result: string,
  },
  value_from_fields?: {
    first: string,
    second: string,
    result: string,
    separator: string
  },
  makeWorkCode?: {
    true: boolean, // just jk
  }
}

@Injectable({
  providedIn: 'root'
})
export class CheckConditionService {

  constructor() {
  }

  // todo: переписать весь сервис с новыми гибкими интерфейсами для постпроцессинга форм

  checkCondition(form: FormGroup, condition: IConditions) {
    // console.log('form and condition', form, condition);
    form.valueChanges.pipe(debounceTime(300)).subscribe(res => {
      // type - тип условия
      Object.keys(condition).forEach(type => {
        // console.log(type);
        if (type === 'lower') {
          // console.log('form contoli', form.controls[condition[type].first].value, form.controls[condition[type].second].value);
          console.log(form.controls[condition[type].first].value < form.controls[condition[type].second].value)
          if (form.controls[condition[type].first].value < form.controls[condition[type].second].value) {
            form.controls[condition[type].first].setErrors({'incorrect': true})
          }
        }
        if (type === 'diff_time') {
          let val1: any = new Date();
          let val2: any = new Date();
          let firstDate = form.controls[condition[type].first].value ? form.controls[condition[type].first].value.split(':'): '';
          let secondDate = form.controls[condition[type].second].value ? form.controls[condition[type].second].value.split(':'): '';
          if (firstDate.length > 1 && secondDate.length > 1) {
            val1.setHours(+firstDate[0].substring(0, 2));
            val1.setMinutes(+firstDate[1].substring(0, 2));
            val1.setSeconds(0);
            val2.setHours(+secondDate[0].substring(0, 2));
            val2.setMinutes(+secondDate[1].substring(0, 2));
            val2.setSeconds(0);
            if (val1 < val2) {
              form.controls[condition[type].first].setErrors(null);
              let diff = Math.abs(val2 - val1);
              let workHours = new Date(diff).getUTCHours();
              let workMinutes = new Date(diff).getUTCMinutes();
              form.controls[condition[type].result].setValue(workHours * 60 + workMinutes, {emitEvent: false});
            } else {
              form.controls[condition[type].first].setErrors(null);
              let diff = Math.abs(val2 - val1);
              let workHours =24 - new Date(diff).getUTCHours();
              let workMinutes = new Date(diff).getUTCMinutes();
              form.controls[condition[type].result].setValue(workHours * 60 + workMinutes, {emitEvent: false});
              // form.controls[condition[type].first].setErrors({'incorrect': true})
            }
          }
        }
        if (type === 'value_from_fields') {
          let worksDays = form.controls[condition[type].first].value? form.controls[condition[type].first].value : '';
          let daysOff = form.controls[condition[type].second].value? form.controls[condition[type].second].value : '';
          form.controls[condition[type].result].setValue(
            worksDays + condition[type].separator + daysOff, {emitEvent: false})
        }
        if (type === 'makeWorkCode'){
          console.log(!!form.controls['code']);
          if (!form.controls['code']){
            form.addControl('code', new FormControl(''));
          }
          let val = form.controls['timeFrom'].value + ' - ' + form.controls['timeTo'].value;
          form.controls['code'].setValue(val, {emitEvent: false});
          console.log(val);
        }
      })
    })
  }
}
