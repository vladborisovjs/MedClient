import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BehaviorSubject, Subscription} from 'rxjs';
import {CallContainer, MedApi, PatientTemplateBean} from '../../../../../swagger/med-api.service';
import {UserService} from '../../../services/user.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CustomModalService} from '../../../shared/modal/services/custom-modal.service';
import {CallItemService} from '../../services/call-item.service';
import {NotificationsService} from 'angular2-notifications';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {FormGroup} from '@angular/forms';
import {MedMapService} from '../../../shared/best-map/services/med-map.service';
import {ModalAviationRequestComponent} from '../modal-aviation-request/modal-aviation-request.component';


@Component({
  selector: 'app-call-item',
  templateUrl: './call-item.component.html',
  styleUrls: ['./call-item.component.scss'],
  providers: [MedMapService]
})
export class CallItemComponent implements OnInit, OnDestroy {
  sbscs: Subscription[] = [];
  callItem: CallContainer;
  description: ISimpleDescription[] = [
    {
      label: 'Тип*',
      key: 'typeFK',
      type: 'dict',
      dict: 'getReferenceTypeListRingTypeUsingGET',
      required: true,
      errorText: 'Поле не может быть пустым',
      styleClass: 'col-4',
      additional: {
        block: 'general'
      },
    },
    {
      label: 'Повод',
      key: 'reasonFK',
      type: 'dict',
      readonly: true,
      bindLabel: 'reason',
      styleClass: 'col-4',
      additional: {
        block: 'general'
      },
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
      styleClass: 'col-4',
      additional: {
        block: 'general'
      },
    },
    {
      label: 'Описание*',
      key: 'reasonComment',
      type: 'textarea',
      errorText: 'Поле не может быть пустым',
      required: true,
      rows: 2,
      additional: {
        block: 'general'
      },
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
      errorText: 'Некорректный номер',
      required: true,
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
      pattern: '^[а-яА-ЯёЁ\\s-]*',
      errorText: 'Только кириллица',
      styleClass: 'col-4',
      additional: {
        block: 'patient'
      }
    },
    {
      label: 'Отчество',
      key: 'patronymic',
      type: 'text',
      pattern: '^[а-яА-ЯёЁ\\s-]*',
      errorText: 'Только кириллица',
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
        {name: 'Не указан', id: null},
        {name: 'Мужской', id: true},
        {name: 'Женский', id: false},
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
      styleClass: 'col-3',
      additional: {
        block: 'patient'
      }

    },
    {
      label: 'Месяцев',
      key: 'ageMonths',
      type: 'number',
      styleClass: 'col-3',
      additional: {
        block: 'patient'
      }
    },
    {
      label: 'Дней',
      key: 'ageDays',
      type: 'number',
      styleClass: 'col-3',
      additional: {
        block: 'patient'
      }
    },
    {
      label: 'Подъезд',
      key: 'entranceNum',
      type: 'text',
      styleClass: 'col-2',
      additional: {
        block: 'address'
      }
    },
    {
      label: 'Домофон',
      key: 'entranceCode',
      type: 'text',
      styleClass: 'col-3',
      additional: {
        block: 'address'
      }
    },
    {
      label: 'Квартира',
      key: 'flatNum',
      type: 'text',
      styleClass: 'col-2',
      additional: {
        block: 'address'
      }
    },
    {
      label: 'Место вызова',
      key: 'placeTypeFK',
      type: 'dict',
      dict: 'getReferenceTypeListCallPlaceUsingGET',
      styleClass: 'col-5',
      additional: {
        block: 'address'
      }
    }
  ];
  patients: { item: PatientTemplateBean, form: FormGroup, subscription: Subscription }[] = [];
  form: FormGroup;
  lockSettingPoint = true; // флаг - надо ли считывать клик с карты для сохранения координат вызова
  isEdit: boolean = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private user: UserService,
              private modal: NgbModal,
              private cmodal: CustomModalService,
              private ns: NotificationsService,
              public cs: CallItemService,
              private sds: SimpleDescriptionService,
              private ms: MedMapService) {
  }

  ngOnInit() {
    this.sbscs.push(
      this.cs.callItemSub.subscribe(
        call => {
          console.log(call);
          this.callItem = call;
          this.callItem.brigadeList = this.callItem.brigadeList ? this.callItem.brigadeList : [];
          this.callItem.call.patientList = this.callItem.call.patientList ? this.callItem.call.patientList : [];
          this.resetPatientList();
        }
      )
    );
    this.form = this.sds.makeForm(this.description);
    this.form.reset(this.callItem.call);
    this.form.disable();
  }

  resetPatientList() {
    this.patients = [];
    this.callItem.call.patientList.forEach(
      (patient) => {
        let form = this.sds.makeForm(this.getBlockDescriptions('patient'));
        form.reset(patient);
        form.disable();
        let item = PatientTemplateBean.fromJS(patient);
        let subscription = form.valueChanges.subscribe(ch => Object.assign(item, ch));
        this.patients.push(
          {
            item: item,
            form: form,
            subscription: subscription
          }
        );
      }
    );
  }


  ngOnDestroy() {
    this.sbscs.forEach(el => el.unsubscribe());
  }


  initMapPoint() {
    if (this.callItem.call.location) {
      this.ms.setPointLonLat(JSON.parse(this.callItem.call.location));
      this.ms.setMapViewOnPoint(JSON.parse(this.callItem.call.location));
    } else {
      this.ms.setDefaultView();
    }
  }

  setCallLocation(geometry) {
    this.callItem.call.location = JSON.stringify(geometry);
  }

  setLocationFromClick(geometry) {
    if (!this.lockSettingPoint && this.isEdit) {
      this.setCallLocation(geometry);
      this.ms.setPointLonLat(geometry);
    }
  }

  setAddressPoint(geometry) {
    this.setCallLocation(this.ms.setPoint(JSON.parse(geometry)));
  }

  addPatient() {
    let item = PatientTemplateBean.fromJS({id: 0, isDeleted: false, call: this.callItem.call.id});
    let form = this.sds.makeForm(this.getBlockDescriptions('patient'));
    let subscription = form.valueChanges.subscribe(ch =>
      Object.assign(item, ch));
    this.patients.push(
      {
        item: item,
        form: form,
        subscription: subscription
      }
    );
  }

  deletePatient(patient) {
    this.cmodal.confirm('Удаление пациента', 'Вы уверены, что хотите удалить пациента' + '?').then(
      res => {
        patient.item.isDeleted = true;
        patient.subscription.unsubscribe();
      },
      () => {
      }
    );
  }

  /** метод для получения описания по
   * блоку в поле аддишнл,
   * чтобы все описания хранились
   * в одном массиве
   */
  getBlockDescriptions(block: string): ISimpleDescription[] {
    return this.description.filter(el => {
      if (el.additional) {
        return el.additional.block === block;
      }
      return false;
    });
  }

  fitCol(e) {
    e.api.sizeColumnsToFit();
  }

  save() {
    this.callItem.call.patientList = this.patients.map(
      pat => pat.item
    );
    this.patients.forEach(pat => pat.subscription.unsubscribe());
    Object.assign(this.callItem.call, this.form.getRawValue());
    this.sbscs.push(
      this.cs.saveCall().subscribe(
        res => {
          this.resetPatientList();
          this.lockForm();
          this.ns.success('Успешно', 'Данные сохранены');
        },
        err => {
          this.ns.error('Ошибка', 'Не удалось сохранить изменения на сервере');
          console.log('Save Call General', err);
        }
      )
    );
  }

  unlockForm() {
    this.form.enable();
    this.patients.forEach(
      patient => patient.form.enable()
    );
    this.isEdit = true;
  }

  lockForm() {
    this.form.disable();
    this.patients.forEach(
      patient => patient.form.disable()
    );
    this.isEdit = false;
  }

  revertForm() {
    this.form.reset(this.callItem.call);
    this.resetPatientList();
    this.lockForm();
  }

  resize(e) {
    this.ms.resizeMap();
  }

  aviationRequest() {
    console.log(this.callItem.call);
    const av = this.modal.open(ModalAviationRequestComponent);
    av.componentInstance.call = this.callItem.call;
    av.result.then(
      result => {
        if (result){
          this.cs.sendAviationRequest(result).subscribe(
            r => {
              console.log(r);
              this.ns.success('Успешно', 'Заявка оправлена')
            },
            error1 => {
              console.log('Request error', error1);
              this.ns.error('Ошибка', 'Не удалось отправить заявку!')
            }
          );
        }
      },
      error => {}
    );

  }

}
