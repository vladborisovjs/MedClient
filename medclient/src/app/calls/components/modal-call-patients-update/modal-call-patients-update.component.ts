import {Component, Input, OnInit} from '@angular/core';
import {CallContainer, CallDto, CallPatientPartDto} from '../../../../../swagger/med-api.service';
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
  @Input() callItem: any;
  description: ISimpleDescription[] = [
    {
      label: 'Фамилия',
      key: 'surname',
      type: 'text',
    },
    {
      label: 'Имя',
      key: 'name',
      type: 'text',
    },
    {
      label: 'Отчество',
      key: 'patronymic',
      type: 'text',
    },
    {
      label: 'Пол',
      key: 'gender',
      type: 'select',
      selectList: [
        {name: 'Не указан', id: 0},
        {name: 'Мужской', id: 1},
        {name: 'Женский', id: 2},
      ],
    },
    {
      label: 'Возраст: лет',
      key: 'ageYears',
      type: 'number',
      styleClass: 'col-4',

    },
    {
      label: 'месяцев',
      key: 'ageMonths',
      type: 'number',
      styleClass: 'col-4',

    },
    {
      label: 'дней',
      key: 'ageDays',
      type: 'number',
      styleClass: 'col-4',
    },
  ];
  descriptionNew: ISimpleDescription[] = [
    {
      label: 'Фамилия:',
      key: 'surname',
      type: 'text',
      errorText: 'Только кириллица',
      pattern: '^[а-яА-ЯёЁ\\s-]*',
      styleClass:'col-4',
    },
    {
      label: 'Имя',
      key: 'name',
      errorText: 'Только кириллица',
      pattern: '^[а-яА-ЯёЁ\\s-]*',
      type: 'text',
      styleClass:'col-4',
    },
    {
      label: 'Отчество',
      key: 'patronymic',
      errorText: 'Только кириллица',
      pattern: '^[а-яА-ЯёЁ\\s-]*',
      type: 'text',
      styleClass:'col-4',
    },
    {
      label: 'Пол',
      key: 'gender',
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
      key: 'ageYears',
      type: 'number',
      styleClass: 'col-3',

    },
    {
      label: 'месяцев',
      key: 'ageMonths',
      type: 'number',
      styleClass: 'col-3',

    },
    {
      label: 'дней',
      key: 'ageDays',
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
    console.log(this.patient);
    this.modalInstance.close();
    // this.cs.savePatient(this.patient, this.callItem.general.call_id).subscribe(
    //   res => {
    //     this.ns.success('Успешно', 'Данные сохранены');
    //     this.back();
    //   },
    //   err => {
    //     this.ns.error('Ошибка', 'Не удалось сохранить изменения на сервере');
    //     console.log('Save patient', err);
    //   }
    // );
  }

  addPatient() {
    this.patients.push(
      {
        item: [],
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
    console.log(newPatients);
    this.modalInstance.close(newPatients);
  }

}
