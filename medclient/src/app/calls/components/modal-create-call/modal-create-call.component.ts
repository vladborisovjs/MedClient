import {Component, Input, OnInit} from '@angular/core';
import {CallsService} from '../../services/calls.service';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {FormGroup} from '@angular/forms';
import {ModalSimilarCallsComponent} from '../modal-similar-calls/modal-similar-calls.component';
import {CallPatientPartDto} from '../../../../../swagger/med-api.service';
import {NotificationsService} from 'angular2-notifications';
import {interval} from 'rxjs';
import {debounce} from 'rxjs/operators';

@Component({
  selector: 'app-modal-create-call',
  templateUrl: './modal-create-call.component.html',
  styleUrls: ['./modal-create-call.component.scss']
})
export class ModalCreateCallComponent implements OnInit {
  form: FormGroup;
  descriptions: ISimpleDescription[] = [
    {
      label: 'Тип',
      key: 'call_type_id',
      type: 'dict',
      shortDict: true,
      dictFilters: {type: 'CALL'},
      dictFiltersOrder: ['type'],
      bindLabel: 'name',
      bindValue: 'id',
      dict: 'readAllUsingGET_34',
      styleClass: 'col-4',
      additional: {
        block: 'general'
      }
    },
    {
      label: 'Повод',
      key: 'reason_id',
      type: 'dict',
      shortDict: true,
      dict: 'readBasicReasonsUsingGET',
      bindLabel: 'title',
      bindValue: 'id',
      styleClass: 'col-4',
      additional: {
        block: 'general'
      }
    },
    {
      label: 'Приоритет',
      key: 'call_priority',
      type: 'select',
      selectList: [
        {name: 'Экстренный', id: 1},
        {name: 'Неотложный', id: 0},
      ],
      styleClass: 'col-4',
      additional: {
        block: 'general'
      }
    },
    {
      label: 'Описание',
      key: 'reason_comment',
      type: 'textarea',
      additional: {
        block: 'general'
      }
    },
    {
      label: 'Необоснованный вызов',
      key: 'is_unfounded',
      type: 'checkbox',
      additional: {
        block: 'general'
      }
    },
    {
      label: 'ФИО',
      key: 'declarant_name',
      type: 'text',
      styleClass: 'col-4',
      additional: {
        block: 'declarant'
      }
    },
    {
      label: 'Телефон',
      key: 'declarant_phone',
      type: 'text',
      styleClass: 'col-4',
      additional: {
        block: 'declarant'
      }
    },
    {
      label: 'Тип',
      key: 'declarant_type_id',
      type: 'dict',
      shortDict: true,
      dictFilters: {type: 'DECLARANT'},
      dictFiltersOrder: ['type'],
      bindLabel: 'name',
      bindValue: 'id',
      dict: 'readAllUsingGET_34',
      styleClass: 'col-4',
      additional: {
        block: 'declarant'
      }
    },
    {
      label: 'Фамилия',
      key: 'patient_secondname',
      type: 'text',
      styleClass: 'col-4',
      additional: {
        block: 'patient'
      }
    },
    {
      label: 'Имя',
      key: 'patient_firstname',
      type: 'text',
      styleClass: 'col-4',
      additional: {
        block: 'patient'
      }
    },
    {
      label: 'Отчество',
      key: 'patient_patronymic',
      type: 'text',
      styleClass: 'col-4',
      additional: {
        block: 'patient'
      }
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
      additional: {
        block: 'patient'
      }
    },
    {
      label: 'Возраст: лет',
      key: 'patient_age_years',
      type: 'number',
      styleClass: 'col-3',
      additional: {
        block: 'patient'
      }

    },
    {
      label: 'Месяцев',
      key: 'patient_age_months',
      type: 'number',
      styleClass: 'col-3',
      additional: {
        block: 'patient'
      }
    },
    {
      label: 'Дней',
      key: 'patient_age_days',
      type: 'number',
      styleClass: 'col-3',
      additional: {
        block: 'patient'
      }
    },
    {
      label: 'Регион',
      key: 'region',
      type: 'text',
      styleClass: 'col-4',
      additional: {
        block: 'address'
      }
    },
    {
      label: 'Район',
      key: 'district',
      type: 'text',
      styleClass: 'col-4',
      additional: {
        block: 'address'
      }
    },
    {
      label: 'Населенный пункт',
      key: 'settlement',
      type: 'text',
      styleClass: 'col-4',
      additional: {
        block: 'address'
      }
    },
    {
      label: 'Улица',
      key: 'street',
      type: 'text',
      styleClass: 'col-6',
      additional: {
        block: 'address'
      }
    },
    {
      label: 'Дом',
      key: 'house',
      type: 'text',
      styleClass: 'col-6',
      additional: {
        block: 'address'
      }
    },
    {
      label: 'Корпус',
      key: 'building',
      type: 'text',
      styleClass: 'col-3',
      additional: {
        block: 'address'
      }
    },
    {
      label: 'Лит./Стр.',
      key: 'structure',
      type: 'text',
      styleClass: 'col-3',
      additional: {
        block: 'address'
      }
    },
    {
      label: 'Подъезд',
      key: 'entrance',
      type: 'text',
      styleClass: 'col-3',
      additional: {
        block: 'address'
      }
    },
    {
      label: 'Домофон',
      key: 'entrance_code',
      type: 'text',
      styleClass: 'col-3',
      additional: {
        block: 'address'
      }
    },
    {
      label: 'Этаж',
      key: 'floor',
      type: 'text',
      styleClass: 'col-3',
      additional: {
        block: 'address'
      }
    },
    {
      label: 'Квартира',
      key: 'flat',
      type: 'text',
      styleClass: 'col-3',
      additional: {
        block: 'address'
      }
    },
    {
      label: 'Комната',
      key: 'room',
      type: 'text',
      styleClass: 'col-3',
      additional: {
        block: 'address'
      }
    },
    {
      label: 'Место вызова',
      key: 'call_place_name',
      type: 'dict',
      shortDict: true,
      dictFilters: {type: 'CALL_PLACE'},
      dictFiltersOrder: ['type'],
      bindLabel: 'name',
      bindValue: 'name',
      dict: 'readAllUsingGET_34',
      styleClass: 'col-3',
      additional: {
        block: 'address'
      }
    }
  ];
  callItem: any;
  patients: any[] = [];
  similarCalls: any[] = [];
  constructor(
    private calls: CallsService,
    private modal: NgbModal,
    private modalInstance: NgbActiveModal,
    private sds: SimpleDescriptionService,
    private ns: NotificationsService,
    ) {
  }

  ngOnInit() {
    this.form = this.sds.makeForm(this.descriptions);
    this.checkPatientsLength();
    this.callItem = this.form.getRawValue();
    this.callItem.patients = [];
    console.log(this.callItem);
    this.form.valueChanges.pipe( debounce(() => interval(300))).subscribe(
      res => {
          this.calls.getSimilarCalls(this.form.getRawValue()).subscribe(
            filtered => {
              this.similarCalls = filtered;
              console.log(this.similarCalls);
            }
          );
      }
    );
  }

  addPatient() {
    this.patients.push(
      {
        item: new CallPatientPartDto,
        form: this.sds.makeForm(this.getBlockDescriptions('patient')),
      }
    );
    for (let i = 0; i < this.patients.length; i++) {
      this.patients[i].form.valueChanges
        .pipe( debounce(() => interval(300)))
        .subscribe(
        res => {
          this.calls.getSimilarCalls(this.patients[i].form.getRawValue()).subscribe(
            filtered => {
              this.similarCalls = filtered;
              console.log(this.similarCalls);
            }
          );
        }
      );
    }
  }

  deletePatient(i) {
    console.log(i);
    this.patients.splice(i, 1);
    this.checkPatientsLength();
  }

  checkPatientsLength() {
    if (!this.patients.length) {
      this.addPatient();
    }
  }
  create() {
    for (let i = 0; i < this.patients.length; i++) {
      this.callItem.patients.push(this.patients[i].form.getRawValue());
    }
    console.log(this.callItem.patients);
    Object.assign(this.callItem, this.form.getRawValue());
    this.calls.createCall(this.callItem).subscribe(
      res => {
        this.ns.success('Успешно', 'Данные сохранены');
        this.cancel();
      },
      err => {
        this.ns.error('Ошибка', 'Не удалось сохранить изменения на сервере');
        console.log('Save new call', err);
      }
    );
  }

  cancel() {
    this.modalInstance.dismiss();
  }

  showSimilarCalls() {
    const simCalls = this.modal.open(ModalSimilarCallsComponent, {size: 'lg'});
    simCalls.componentInstance.listSimCalls = this.similarCalls;
    simCalls.result.then(
      success => {
          if (success.patients[0] !== undefined) {
            this.patients[0].item.patient_firstname = success.patients[0].split(' ')[0];
            this.patients[0].item.patient_secondname = success.patients[0].split(' ')[1];
            this.patients[0].item.patient_patronymic = success.patients[0].split(' ')[2];
          }
          this.callItem.declarant_name = success.declarant_name;
          this.callItem.declarant_phone = success.declarant_phone;
          this.callItem.is_unfounded = success.is_unfounded;
          this.form.reset(this.callItem);
          this.patients[0].form.reset(this.patients[0].item);
      },
      res => {}
    );
  }

  getBlockDescriptions(block: string): ISimpleDescription[] {
    return this.descriptions.filter(el => {
      if (el.additional) {
        return el.additional.block === block;
      }
      return false;
    });
  }
}
