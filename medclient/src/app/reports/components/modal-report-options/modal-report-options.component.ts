import {Component, Input, OnInit} from '@angular/core';
import {IReport} from "../../models/report-models";
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormControl, FormGroup} from '@angular/forms';
import {
  ISimpleDescription,
  SimpleDescriptionService
} from "../../../shared/simple-control/services/simple-description.service";
import {ModalSubdivisionTreeComponent} from '../modal-subdivision-tree/modal-subdivision-tree.component';

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
  constructor(private modalInstance: NgbActiveModal, private sds: SimpleDescriptionService, private modal: NgbModal) {
  }

  ngOnInit() {
    console.log(this.report);
    this.report.inputParams.forEach(
      ip => {
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
              required: true,
              errorText: 'Обязательное',
              selectList: this.months,
              styleClass: 'col-8'
            },
            {
              label: 'год',
              key: 'year',
              type: 'number',
              required: true,
              errorText: 'Обязательное',
              styleClass: 'col-4',
            },
          );
          this.options.year = new Date().getFullYear();
          this.options.month = new Date().getMonth();
        }
        if (ip.subdivision) {
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
      }
    );
    this.form = this.sds.makeForm(this.descriptions);
    this.form.reset(this.options);
  }

  back() {
    this.modalInstance.dismiss();
  }

  openSubTree() {
    const subTree = this.modal.open(ModalSubdivisionTreeComponent, {size: 'lg'});
    subTree.result.then(
      subdivision => {
        this.form.controls['subdivision'].setValue(subdivision.name);
        this.subdivision = subdivision.id;
        console.log(subdivision);
      }
    );
  }

  print() {
    Object.assign(this.options, this.form.getRawValue());
    console.log(this.options);
    if (this.options._day) {
      let df = {
        dateFrom: (new Date(Date.UTC(this.options._day.getFullYear(), this.options._day.getMonth(), this.options._day.getDate(), 0, 0, 0, 0))).toISOString().slice(0, 19),
        dateTo: (new Date(Date.UTC(this.options._day.getFullYear(), this.options._day.getMonth(), this.options._day.getDate(), 23, 59, 59, 999))).toISOString().slice(0, 19)
      };
      Object.assign(this.options, df);
    }
    if (this.options._dateFrom && this.options._dateTo) {
      let period = {
        dateFrom: (new Date(Date.UTC(this.options._dateFrom.getFullYear(), this.options._dateFrom.getMonth(), this.options._dateFrom.getDate(), 0, 0, 0, 0))).toISOString().slice(0, 19),
        dateTo: (new Date(Date.UTC(this.options._dateTo.getFullYear(), this.options._dateTo.getMonth(), this.options._dateTo.getDate(), 23, 59, 59, 999))).toISOString().slice(0, 19)
      };
      Object.assign(this.options, period);
    }
    if (this.options.subdivision) {
      this.options.subdivision = this.subdivision;
    }
    if (this.options.month) {
      console.log(this.options.month);
      let monthPeriod = {
        dateFrom: (new Date(Date.UTC(this.options.year, this.options.month, 1, 0, 0, 0, 0))).toISOString().slice(0, 19),
        dateTo: (new Date(Date.UTC(this.options.year, this.options.month + 1, 0, 23, 59, 59, 999))).toISOString().slice(0, 19)
      };
      Object.assign(this.options, monthPeriod);
    }
    console.log(this.options);
    this.modalInstance.close(this.options);
  }

}
