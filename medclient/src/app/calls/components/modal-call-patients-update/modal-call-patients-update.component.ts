import {Component, Input, OnInit} from '@angular/core';
import {CallDto, CallPatientPartDto} from '../../../../../swagger/med-api.service';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {FormGroup} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {CallItemService} from '../../services/call-item.service';
import {NotificationsService} from 'angular2-notifications';

@Component({
  selector: 'app-modal-call-patients-update',
  templateUrl: './modal-call-patients-update.component.html',
  styleUrls: ['./modal-call-patients-update.component.scss']
})
export class ModalCallPatientsUpdateComponent implements OnInit {
  @Input() patient: any;
  @Input() edit: boolean; // признак режима нового пациента или редактируемого
  form: FormGroup;
  forms: FormGroup[] = [];
  @Input() callItem: CallDto;
  description: ISimpleDescription[] = [
    {
      label: 'Фамилия',
      key: 'patient_secondname',
      type: 'text',
    },
    {
      label: 'Имя',
      key: 'patient_firstname',
      type: 'text',
    },
    {
      label: 'Отчество',
      key: 'patient_patronymic',
      type: 'text',
    },
    {
      label: 'Пол',
      key: 'patient_sex',
      type: 'select',
      selectList: [
        {name: 'Не указан', id: 0},
        {name: 'Мужской', id: 1},
        {name: 'Женский', id: 2},
      ],
    },
    {
      label: 'Возраст: лет',
      key: 'patient_age_years',
      type: 'number',
      styleClass: 'col-4',

    },
    {
      label: 'месяцев',
      key: 'patient_age_months',
      type: 'number',
      styleClass: 'col-4',

    },
    {
      label: 'дней',
      key: 'patient_age_days',
      type: 'number',
      styleClass: 'col-4',
    },
  ];
  descriptionNew: ISimpleDescription[] = [
    {
      label: 'Фамилия:',
      key: 'patient_secondname',
      type: 'text',
      styleClass:'col-4',
    },
    {
      label: 'Имя',
      key: 'patient_firstname',
      type: 'text',
      styleClass:'col-4',
    },
    {
      label: 'Отчество',
      key: 'patient_patronymic',
      type: 'text',
      styleClass:'col-4',
    },
    {
      label: 'Пол',
      key: 'patient_sex',
      type: 'select',
      selectList: [
        {name: 'Не указан', id: 0},
        {name: 'Мужской', id: 1},
        {name: 'Женский', id: 2},
      ],
      styleClass: 'col-3',
    },
    {
      label: 'Возраст: лет',
      key: 'patient_age_years',
      type: 'number',
      styleClass: 'col-3',

    },
    {
      label: 'месяцев',
      key: 'patient_age_months',
      type: 'number',
      styleClass: 'col-3',

    },
    {
      label: 'дней',
      key: 'patient_age_days',
      type: 'number',
      styleClass: 'col-3',
    },
  ];
  patients: any[] = []; // массив новых пациентов

  constructor(
    private modalInstance: NgbActiveModal,
    private cs: CallItemService,
    private ns: NotificationsService,
    private sds: SimpleDescriptionService
  ) {
  }

  ngOnInit() {
    this.edit = !!this.patient;
    console.log(this.description);
    if (!this.edit) {
      this.addPatient();
    } else {
      this.form = this.sds.makeForm(this.description);
    }
  }

  back() {
    this.modalInstance.dismiss();
  }

  save() {
    Object.assign(this.patient, this.form.getRawValue());
    this.cs.savePatient(this.patient, this.callItem.general.call_id).subscribe(
      res => {
        this.ns.success('Успешно', 'Данные сохранены');
        this.back();
      },
      err => {
        this.ns.error('Ошибка', 'Не удалось сохранить изменения на сервере');
        console.log('Save patient', err);
      }
    );
  }

  addPatient() {
    this.patients.push(
      {
        item: new CallPatientPartDto,
        form: this.sds.makeForm(this.description)
      }
    );
  }

  deletePatient(i) {
    console.log(i);
    this.patients.splice(i, 1);
    if (!this.patients.length){
      this.addPatient();
    }
  }

  saveNewPatients() {
    let newPatients = [];
    this.patients.forEach(
      pat => newPatients.push(pat.form.getRawValue())
    );
    this.cs.addPatients(newPatients ,this.callItem.general.call_id).subscribe(
      res => {
        this.ns.success('Успешно', 'Данные сохранены');
        this.back();
      },
      err => {
        this.ns.error('Ошибка', 'Не удалось сохранить изменения на сервере');
        console.log('Save patient', err);
      }
    );
  }

}
