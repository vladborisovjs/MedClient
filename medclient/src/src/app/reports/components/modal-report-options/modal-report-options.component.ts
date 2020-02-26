import {Component, Input, OnInit} from '@angular/core';
import {IReport} from "../../models/report-models";
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormControl, FormGroup} from '@angular/forms';
import {
  ISimpleDescription,
  SimpleDescriptionService
} from "../../../shared/simple-control/services/simple-description.service";
import {ModalSubdivisionTreeComponent} from '../modal-subdivision-tree/modal-subdivision-tree.component';
import {NotificationsService} from 'angular2-notifications';

@Component({
  selector: 'app-modal-report-options',
  templateUrl: './modal-report-options.component.html',
  styleUrls: ['./modal-report-options.component.scss']
})
export class ModalReportOptionsComponent implements OnInit {
  @Input() report: IReport;
  form: FormGroup;
  descriptions: ISimpleDescription[] = [];
  options: any = {};
  subdivision: any[];
  isMultiple: boolean = false; // флаг для одинарного или множественного выделения в дереве
  months = [
    {name: 'Январь', id: '0'},
    {name: 'Февраль', id: 1},
    {name: 'Март', id: 2},
    {name: 'Апрель', id: 3},
    {name: 'Май', id: 4},
    {name: 'Июнь', id: 5},
    {name: 'Июль', id: 6,},
    {name: 'Август', id: 7},
    {name: 'Сентябрь', id: 8},
    {name: 'Октябрь', id: 9},
    {name: 'Ноябрь', id: 10},
    {name: 'Декабрь', id: 11},
  ];
  typeDoc = [
    {name: 'Отчет', id: 0},
    {name: 'График', id: 1},
  ];
  constructor(private modalInstance: NgbActiveModal, private sds: SimpleDescriptionService, private modal: NgbModal, private ns: NotificationsService) {
  }

  ngOnInit() {
    console.log(this.report);
    this.report.inputParams.forEach(
      ip => {
        if (ip.typeDoc) {
          this.descriptions.push(
            {
              label: 'Тип документа',
              key: 'typeDoc',
              type: 'select',
              required: true,
              errorText: 'Обязательное',
              selectList: this.typeDoc,
            }
          );
        }
        if (ip.day) {
          this.descriptions.push(
            {
              key: '_day',
              type: 'date',
              showTime: false,
              label: 'Дата',
              errorText: 'Заполните поле',
              required: true
            }
          );
          //this.options._day = new Date();
        }
        if (ip.period) {
          this.descriptions.push(
            {
                key: '_dateFrom',
                type: 'date',
                label: 'C',
                showTime: false,
                required: true,
                errorText: 'Заполните поле'
            },
            {
                key: '_dateTo',
                type: 'date',
                label: 'По',
                showTime: false,
                required: true,
                errorText: 'Заполните поле'
            },
          );
        }
        if (ip.month) {
          this.descriptions.push(
            {
              label: 'месяц',
              key: 'month',
              type: 'select',
              errorText: 'Обязательное',
              selectList: this.months,
              styleClass: 'col-8'
            },
            {
              label: 'год',
              key: 'year',
              type: 'number',
              errorText: 'Обязательное',
              styleClass: 'col-4',
            },
          );
          this.options.year = new Date().getFullYear();
          //this.options.month = new Date().getMonth() + 1;
        }
        if (ip.subdivision || ip.subdivisionList) {
          if (ip.subdivisionList) {
            this.isMultiple = true;
          }
          this.descriptions.push(
            {
                label: 'Подразделение',
                type: 'text',
                key: 'subdivision',
                readonly: true,
                styleClass: 'col-9',
                required: true
            },
            {
              label: '',
              placeholder: 'Выбрать',
              key: '',
              type: 'btn',
              action: this.openSubTree.bind(this),
              btnClass: 'mt-4 btn btn-info',
              styleClass: 'col-3',
            }
          );
        }
        if (ip.type) {
          this.options.type = ip.type;
        }
        if (ip.multiplePrint) {
          this.options.multiplePrint = ip.multiplePrint;
        }
      }
    );
    this.form = this.sds.makeForm(this.descriptions);
    this.form.reset(this.options);
  }

  back() {
    this.modalInstance.dismiss();
  }

  checkDate(dateFrom: string, dateTo: string, typeDoc?: number) {
    let today = new Date().toISOString().slice(0, 10);
    if (!typeDoc && (dateFrom.slice(0, 10) > today || dateTo.slice(0, 10) > today)) {
      if (this.options.month) {
        this.ns.warn('Некорректная дата', 'Для отчетов только до текущего месяца');
      } else {
        this.ns.warn('Некорректная дата', 'Для отчетов только до текущей даты');
      }
    } else if (typeDoc === 1 && (dateFrom.slice(0, 10) < today || dateTo.slice(0, 10) < today)) {
      this.ns.warn('Некорректная дата', 'Для графиков только после текущего месяца');
    } else {
      this.modalInstance.close(this.options);
    }
  }

  openSubTree() {
    const subTree = this.modal.open(ModalSubdivisionTreeComponent, {size: 'lg'});
    subTree.componentInstance.isMultiple = this.isMultiple;
    subTree.result.then(
      subdivision => {
        if (this.isMultiple) {
          console.log(subdivision);
          let listNames = '';
          this.subdivision = subdivision.map((subId) => {return subId.data.id});
          console.log(subdivision.map((subId) => {return subId.data.name}));
          subdivision.map((subId) => {return subId.data.name}).forEach(
            el => {
              listNames += `${el}, `;
            }
          );
          listNames = listNames.slice(0, -2);
          this.form.controls['subdivision'].setValue(listNames);
          console.log(this.subdivision);
        }
        else {
          this.form.controls['subdivision'].setValue(subdivision.name);
          this.subdivision = subdivision.id;
          console.log(subdivision);
        }


      }
    );
  }

  print() {
    Object.assign(this.options, this.form.getRawValue());
    console.log(this.options);
    if (this.options._day) {
      let df = {
        dateFrom: (new Date(this.options._day.getFullYear(), this.options._day.getMonth(), this.options._day.getDate())).toISOString().slice(0, 19),
        dateTo: (new Date(this.options._day.getFullYear(), this.options._day.getMonth(), this.options._day.getDate(),23, 59,59)).toISOString().slice(0, 19)
      };
      Object.assign(this.options, df);
      this.checkDate(df.dateFrom, df.dateTo);
    }
    if (this.options._dateFrom && this.options._dateTo) {
      let period = {
        dateFrom: (new Date(this.options._dateFrom.getFullYear(), this.options._dateFrom.getMonth(), this.options._dateFrom.getDate())).toISOString().slice(0, 19),
        dateTo: (new Date(this.options._dateTo.getFullYear(), this.options._dateTo.getMonth(), this.options._dateTo.getDate(), 23, 59,59)).toISOString().slice(0, 19)
      };
      Object.assign(this.options, period);
      this.checkDate(period.dateFrom, period.dateTo);
    }
    if (this.options.subdivision) {
      this.options.subdivision = this.subdivision;
    }
    if (this.options.month) {
      console.log(this.options.month);
      let monthPeriod = {
        dateFrom: (new Date(this.options.year, this.options.month)).toISOString().slice(0, 19),
        dateTo: (new Date(this.options.year, this.options.month, 23, 59,59)).toISOString().slice(0, 19)
      };
      Object.assign(this.options, monthPeriod);
      this.checkDate(monthPeriod.dateFrom, monthPeriod.dateTo, this.options.typeDoc);
    }
    console.log(this.options);
    //this.modalInstance.close(this.options);
  }

}
