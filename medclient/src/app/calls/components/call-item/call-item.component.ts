import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {interval, Subject, Subscription} from 'rxjs';
import {CallContainer, CallPatientPartDto, MedApi, ReferenceTypeBean} from '../../../../../swagger/med-api.service';
import {UserService} from '../../../services/user.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalCallPatientsUpdateComponent} from '../modal-call-patients-update/modal-call-patients-update.component';
import {CustomModalService} from '../../../shared/modal/services/custom-modal.service';
import {CallItemService} from '../../services/call-item.service';
import {NotificationsService} from 'angular2-notifications';
import {ModalCallAppointBrigadeComponent} from '../modal-call-appoint-brigade/modal-call-appoint-brigade.component';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {FormGroup} from '@angular/forms';
import {IMapParams} from '../../../shared/best-map/models/map-manager';
import {debounce} from 'rxjs/operators';

@Component({
  selector: 'app-call-item',
  templateUrl: './call-item.component.html',
  styleUrls: ['./call-item.component.scss']
})
export class CallItemComponent implements OnInit, OnDestroy {
  sbscs: Subscription[] = [];
  callItem: CallContainer;
  description: ISimpleDescription[] = [
    {
      label: 'Тип*',
      key: 'typeFK',
      type: 'dict',
      dict: 'getReferenceTypeListCallUsingGET',
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
    // {
    //   label: 'Этаж',
    //   key: 'floor',
    //   type: 'text',
    //   styleClass: 'col-2',
    //   additional: {
    //     block: 'address'
    //   }
    // },
    {
      label: 'Квартира',
      key: 'flatNum',
      type: 'text',
      styleClass: 'col-2',
      additional: {
        block: 'address'
      }
    },
    // {
    //   label: 'Комната',
    //   key: 'room',
    //   type: 'text',
    //   styleClass: 'col-2',
    //   additional: {
    //     block: 'address'
    //   }
    // },
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
  form: FormGroup;
  isEdit: boolean = false;

  // сюда пихать события для перерисовки карты, {type: resize, value: {}} resize - изменение размеров контейнера
  mapChange: Subject<{ type: string, value: any }> = new Subject<{ type: string, value: any }>();

  constructor(private route: ActivatedRoute,
              private api: MedApi,
              private user: UserService,
              private modal: NgbModal,
              private cmodal: CustomModalService,
              private ns: NotificationsService,
              private cs: CallItemService,
              private sds: SimpleDescriptionService) {
  }

  ngOnInit() {
    this.sbscs.push(
      this.cs.callItemSub.subscribe(
        call => {
          this.callItem = call;
          this.callItem.brigadeList = this.callItem.brigadeList ? this.callItem.brigadeList : [];
          this.callItem.patientList = this.callItem.patientList ? this.callItem.patientList : [];
        }
      )
    );
    this.form = this.sds.makeForm(this.description);
    this.form.reset(this.callItem.call);
    this.form.disable();
  }


  ngOnDestroy() {
    this.sbscs.forEach(el => el.unsubscribe());
  }

  editPatients(patient?) {
    const patModal = this.modal.open(ModalCallPatientsUpdateComponent, {size: !patient ? 'lg' : null});
    patModal.componentInstance.callItem = this.callItem;
    patModal.componentInstance.patient = patient;
    patModal.result.then(
      res => {
        if (res)
          res.forEach(el => this.callItem.patientList.push(el));
      }
    );
  }

  deletePatient(patient) {
    this.cmodal.confirm('Удаление пациента', 'Вы уверены, что хотите удалить пациента' + '?').then(
      res => {
        this.callItem.patientList.splice(patient, 1);
        this.ns.success('Успешно', 'Пациент удален');
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
    console.log(this.form.getRawValue());
    Object.assign(this.callItem.call, this.form.getRawValue());
    this.sbscs.push(
      this.cs.saveCall().subscribe(
        res => {
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
    this.isEdit = true;
  }

  lockForm() {
    this.form.disable();
    this.isEdit = false;
  }

  revertForm() {
    this.form.reset(this.callItem.call);
    this.lockForm();
  }

  resize(e) {
    this.mapChange.next({
      type: 'resize',
      value: e,
    });
  }
}
