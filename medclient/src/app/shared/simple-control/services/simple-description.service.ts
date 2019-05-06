import {Injectable} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

export interface ISimpleDescription {
  key: string; // наименование поля (ключ объекта)
  type: string; // text, number, textarea, dict, template, select
  label?: string; // название
  errorText?: string; // текст для вывода ошибки
  placeholder?: string;
  required?: boolean; // обязательность
  pattern?: RegExp | string ;// паттерн для ввода
  dict?: string; // наименование метода словаря
  alwaysDisabled?: boolean;
  dictFilters?: any; // объект фильтров
  dictFiltersOrder?: string[]; // порядок фильтров
  dictSearchField?: string; // поля по которому происходит поиск в словаре
  shortDict?: boolean;
  dropdownPosition?: string;
  hide?: boolean; // скрыть
  bindLabel?: string; // поле для отображение
  bindValue?: string; // поле для отображение
  templateField?: string; // поле принимаемое для подстановки из шаблона
  styleClass?: string;
  rows?: number; // строки Textarea
  necessary?: { // обязательные поля для активации контрола
    key: string; // наименование поля требуемого объекта
    keyField?: string; // поле из родителя, нужное для фильтрации
    subField?: string; // поле в которое фильтр подставляется
    selectList?: any; // поле со стрелочной функцией, которую просчитываем по аргументу родителя и вставляем в selectList
    funcParam?: any; // поле из родителя, подставляемое в аргумент функции
  }[];
  additional?: any;
  order?: number;
  selectList?: any[];
}

@Injectable()
export class SimpleDescriptionService {

  constructor() {
  }

  makeForm(sd: ISimpleDescription[], fg: FormGroup = new FormGroup({}), sort = false): FormGroup {
    if (!fg) {
      fg = new FormGroup({});
    }
    if (sort) {
      sd.sort((a, b) => {
        if (a.order) {
          if (!b.order) {
            return -1;
          } else {
            if (a.order < b.order) {
              return -1;
            } else {
              return 1;
            }
          }
        } else {
          if (b.order) {
            return 1;
          } else {
            return 0;
          }
        }
      });
    }
    sd.forEach(el => {
      const vldtrs = [];
      if (el.pattern) {
        vldtrs.push(Validators.pattern(el.pattern));
      }
      if (el.required) {
        vldtrs.push(Validators.required);

      }
      if (fg.get(el.key)) {
      } else {
        fg.setControl(el.key, new FormControl(null, vldtrs));
      }
    });
    return fg;
  }
}
