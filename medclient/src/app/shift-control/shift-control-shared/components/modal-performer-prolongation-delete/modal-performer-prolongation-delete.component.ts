import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ISimpleDescription} from "../../../../shared/simple-control/services/simple-description.service";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-modal-performer-prolongation-delete',
  templateUrl: './modal-performer-prolongation-delete.component.html',
  styleUrls: ['./modal-performer-prolongation-delete.component.scss']
})
export class ModalPerformerProlongationDeleteComponent implements OnInit {
  @Input() period: { dateFrom: Date, dateTo: Date };

  descriptions: ISimpleDescription[] = [
    {
      label: 'Начало',
      key: 'dateFrom',
      type: 'date',
      showTime: false,
      required: true,
      styleClass: 'col-6',
      additional: {
        block: 'schedule'
      }
    },
    {
      label: 'Окончание',
      key: 'dateTo',
      type: 'date',
      required: true,
      showTime: false,
      // timeOnlyWithDate: this.date,
      styleClass: 'col-6',
      additional: {
        block: 'schedule'
      }
    },
  ];
  form: FormGroup = new FormGroup(
    {
      dateFrom: new FormControl(),
      dateTo: new FormControl(),
    }
  );

  canSubmit: boolean = true;

  constructor(private modalInstance: NgbActiveModal) {
  }

  ngOnInit() {
    this.form.reset(this.period);
    this.form.valueChanges.subscribe(ch => {
        this.period = ch;
        this.period.dateFrom.setHours(new Date().getTimezoneOffset() / (-60)); // todo: перенести танцы со временем в сервис
        this.period.dateTo.setHours(new Date().getTimezoneOffset() / (-60)); // todo: перенести танцы со временем в сервис
        this.canSubmit = !!(this.period && this.period.dateTo && this.period.dateFrom &&
          (this.period.dateFrom < this.period.dateTo));
      }
    );
  }

  back() {
    this.modalInstance.dismiss();
  }

  submit() {
    this.modalInstance.close(this.period);
  }
}
