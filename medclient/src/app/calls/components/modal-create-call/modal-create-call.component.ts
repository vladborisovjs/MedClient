import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CallsService} from '../../services/calls.service';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {FormGroup} from '@angular/forms';
import {ModalSimilarCallsComponent} from '../modal-similar-calls/modal-similar-calls.component';
import {CallContainer, CallPatientPartDto} from '../../../../../swagger/med-api.service';
import {NotificationsService} from 'angular2-notifications';
import {interval, Subscription} from 'rxjs';
import {debounce} from 'rxjs/operators';
import {ModalCallInquirerComponent} from '../modal-call-inquirer/modal-call-inquirer.component';

@Component({
  selector: 'app-modal-create-call',
  templateUrl: './modal-create-call.component.html',
  styleUrls: ['./modal-create-call.component.scss']
})
export class ModalCreateCallComponent implements OnInit, OnDestroy {
  form: FormGroup;
  descriptions: ISimpleDescription[] = [
    {
      label: 'Тип*',
      key: 'typeFK',
      type: 'dict',
      dict: 'getReferenceTypeListCallUsingGET',
      styleClass: 'col-4',
      required: true,
      errorText: 'Поле не может быть пустым',
      additional: {
        block: 'general'
      },
    },
    {
      label: 'Повод*',
      key: 'reasonFK',
      type: 'dict',
      readonly: true,
      required: true,
      errorText: 'Поле не может быть пустым',
      bindLabel: 'reason',
      styleClass: 'col-4',
      additional: {
        block: 'general'
      }
    },
    {
      label: '',
      placeholder: 'Опросить',
      key: '',
      type: 'btn',
      action: this.ask.bind(this),
      btnClass: 'mt-4  btn btn-info',
      styleClass: 'col-1',
      additional: {
        block: 'general'
      }
    },
    {
      label: 'Приоритет*',
      key: 'priority',
      type: 'select',
      required: true,
      errorText: 'Поле не может быть пустым',
      selectList: [
        {name: 'Экстренный', id: 1},
        {name: 'Неотложный', id: 0},
      ],
      styleClass: 'col-3',
      additional: {
        block: 'general'
      }
    },
    {
      label: 'Описание*',
      key: 'reasonComment',
      type: 'textarea',
      errorText: 'Поле не может быть пустым',
      required: true,
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
      label: 'ФИО*',
      key: 'declarantName',
      type: 'text',
      required: true,
      errorText: 'Только кириллица',
      pattern: '^[а-яА-ЯёЁ\\s-]*',
      styleClass: 'col-4',
      additional: {
        block: 'declarant'
      }
    },
    {
      label: 'Телефон*',
      key: 'declarantPhone',
      type: 'number',
      required: true,
      pattern: '^[0-9]*',
      errorText: 'Некорректный номер',
      styleClass: 'col-4',
      additional: {
        block: 'declarant'
      }
    },
    {
      label: 'Тип*',
      key: 'declarantTypeFK',
      type: 'dict',
      required: true,
      errorText: 'Поле не может быть пустым',
      dict: 'getReferenceTypeListDeclarantUsingGET',
      styleClass: 'col-4',
      additional: {
        block: 'declarant'
      }
    },
    {
      label: 'Фамилия',
      key: 'surname',
      type: 'text',
      pattern: '^[а-яА-ЯёЁ\\s-]*',
      errorText: 'Только кириллица',
      styleClass: 'col-4',
      additional: {
        block: 'patient'
      }
    },
    {
      label: 'Имя',
      key: 'name',
      type: 'text',
      errorText: 'Только кириллица',
      pattern: '^[а-яА-ЯёЁ\\s-]*',
      styleClass: 'col-4',
      additional: {
        block: 'patient'
      }
    },
    {
      label: 'Отчество',
      key: 'patronymic',
      errorText: 'Только кириллица',
      pattern: '^[а-яА-ЯёЁ\\s-]*',
      type: 'text',
      styleClass: 'col-4',
      additional: {
        block: 'patient'
      }
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
      additional: {
        block: 'patient'
      }
    },
    {
      label: 'Возраст: лет',
      key: 'ageYears',
      type: 'number',
      pattern: '^[0-9]*',
      errorText: 'Поле не может быть отрицательным',
      styleClass: 'col-3',
      additional: {
        block: 'patient'
      }

    },
    {
      label: 'Месяцев',
      key: 'ageMonths',
      type: 'number',
      pattern: '^[0-9]*',
      errorText: 'Поле не может быть отрицательным',
      styleClass: 'col-3',
      additional: {
        block: 'patient'
      }
    },
    {
      label: 'Дней',
      key: 'ageDays',
      type: 'number',
      pattern: '^[0-9]*',
      errorText: 'Поле не может быть отрицательным',
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
      styleClass: 'col-4',
      additional: {
        block: 'address'
      }
    },
    {
      label: 'Дом',
      key: 'house',
      type: 'text',
      styleClass: 'col-2',
      additional: {
        block: 'address'
      }
    },
    {
      label: 'Корпус',
      key: 'building',
      type: 'text',
      styleClass: 'col-2',
      additional: {
        block: 'address'
      }
    },
    {
      label: 'Лит./Стр.',
      key: 'structure',
      type: 'text',
      styleClass: 'col-2',
      additional: {
        block: 'address'
      }
    },
    {
      label: 'Подъезд',
      key: 'entrance',
      type: 'text',
      styleClass: 'col-2',
      additional: {
        block: 'address'
      }
    },
    {
      label: 'Домофон',
      key: 'entrance_code',
      type: 'text',
      styleClass: 'col-2',
      additional: {
        block: 'address'
      }
    },
    {
      label: 'Этаж',
      key: 'floor',
      type: 'text',
      styleClass: 'col-2',
      additional: {
        block: 'address'
      }
    },
    {
      label: 'Квартира',
      key: 'flat',
      type: 'text',
      styleClass: 'col-2',
      additional: {
        block: 'address'
      }
    },
    {
      label: 'Комната',
      key: 'room',
      type: 'text',
      styleClass: 'col-2',
      additional: {
        block: 'address'
      }
    },
    {
      label: 'Место вызова',
      key: 'call_place_name',
      type: 'dict',
      bindValue: 'id',
      dict: 'getReferenceTypeListCallPlaceUsingGET',
      styleClass: 'col-4',
      additional: {
        block: 'address'
      }
    }
  ];
  callItem: any = {};
  patients: any[] = [];
  similarCalls: any[] = [];
  sbscs: Subscription[] = [];
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
    this.callItem.patientList = [];
    this.sbscs.push(
      this.form.valueChanges.pipe( debounce(() => interval(300))).subscribe(
        res => {
          Object.assign(this.callItem, this.form.getRawValue());
          this.calls.getSimilarCalls(this.callItem).subscribe(
            filtered => {
              this.similarCalls = filtered;
            }
          );
        }
      )
    );
  }

  ngOnDestroy() {
    this.sbscs.forEach( el => el.unsubscribe());
  }
  // опрос повода к вызову
  ask(){
    const askWin = this.modal.open(ModalCallInquirerComponent);
    askWin.result.then(res=> {
      if (res){
        console.log('опросили', res);
        this.form.controls['reasonFK'].setValue(res);
      }
    });
  }

  addPatient() {
    this.patients.push(
      {
        item: [],
        form: this.sds.makeForm(this.getBlockDescriptions('patient')),
      }
    );

    for (let i = 0; i < this.patients.length; i++) {
      this.sbscs.push(
        this.patients[i].form.valueChanges
          .pipe( debounce(() => interval(300)))
          .subscribe(
            res => {
              Object.assign(this.callItem, this.form.getRawValue());
              this.callItem.patientList[i] = this.patients[i].form.getRawValue();
              this.calls.getSimilarCalls(this.callItem).subscribe(
                filtered => {
                  this.similarCalls = filtered;
                }
              );
            }
          )
      );
    }
  }

  deletePatient(i) {
    this.patients.splice(i, 1);
    this.callItem.patientList.splice(i, 1);
    this.checkPatientsLength();
  }

  checkPatientsLength() {
    if (!this.patients.length) {
      this.addPatient();
    }
  }
  create() {
    this.callItem.call = this.form.getRawValue();
    this.callItem.brigadeList = [];
    this.callItem.call.date = new Date();
    this.callItem.call.status = null;
    //this.callItem.patientList = [];
    console.log(this.callItem);
    this.sbscs.push(
      this.calls.createCall(CallContainer.fromJS(this.callItem)).subscribe(
        res => {
          this.ns.success('Успешно', 'Данные сохранены');
          this.modalInstance.close(res);
        },
        err => {
          this.ns.error('Ошибка', 'Не удалось сохранить изменения на сервере');
          console.log('Save new call', err);
        }
      )
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
