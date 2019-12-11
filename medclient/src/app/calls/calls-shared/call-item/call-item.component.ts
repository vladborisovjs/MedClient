import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {
  API_BASE_URL,
  CallContainer,
  PatientBean,
  PatientTemplateBean,
  RecordType
} from '../../../../../swagger/med-api.service';
import {UserService} from '../../../services/user.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CustomModalService} from '../../../shared/modal/services/custom-modal.service';
import {CallItemService} from '../../services/call-item.service';
import {NotificationsService} from 'angular2-notifications';
import {
  ISimpleDescription,
  SimpleDescriptionService
} from '../../../shared/simple-control/services/simple-description.service';
import {FormGroup, Validators} from '@angular/forms';
import {MedMapService} from '../../../shared/best-map/services/med-map.service';
import {ModalAviationRequestComponent} from '../modal-aviation-request/modal-aviation-request.component';
import {ModalAviaRequestInfoComponent} from '../modal-avia-request-info/modal-avia-request-info.component';
import {LogService} from "../../../shared/logs/log.service";
import {MedAudioPlayerService} from "../../../shared/audio-player/med-audio-player.service";
import {LOCK_CONF, TeldaNgLocksService} from "telda-ng-locks";
import {take} from "rxjs/operators";
import {SocketTopicsService} from "../../../shared/socket-topic/services/socket-topics.service";
import {RoleAccessService} from "../../../services/role-access.service";
import {ModalCallInquirerComponent} from '../modal-call-inquirer/modal-call-inquirer.component';
import {ModalCallPatientArchiveComponent} from "../modal-call-patient-archive/modal-call-patient-archive.component";


@Component({
  selector: 'app-call-item',
  templateUrl: './call-item.component.html',
  styleUrls: ['./call-item.component.scss'],
  providers: [MedMapService,
    TeldaNgLocksService,
    {
      provide: LOCK_CONF,
      useFactory: (url) => {
        return {
          name: `call`,
          url: `${url}/api/andy/locks/call`
        };
      },
      deps: [API_BASE_URL]
    },
  ]
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
      errorText: 'Обязательное',
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
      errorText: 'Обязательное',
      selectList: [
        {name: 'Экстренный', id: 1},
        {name: 'Неотложный', id: 0},
      ],
      styleClass: 'col-3',
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
      errorText: 'Обязательное',
      bindLabel: 'reason',
      styleClass: 'col-4',
      additional: {
        block: 'general'
      }
    },
    {
      label: '',
      placeholder: 'Опросить',
      key: 'askButton',
      type: 'btn',
      action: this.ask.bind(this),
      btnClass: 'mt-4 btn btn-info',
      styleClass: 'col-1',
      additional: {
        block: 'general'
      }
    },
    {
      label: 'Описание',
      key: 'reasonComment',
      type: 'textarea',
      rows: 2,
      additional: {
        block: 'general'
      },
    },
    {
      label: 'Признак ЧС*',
      key: 'emergencySituation',
      type: 'select',
      required: true,
      errorText: 'Обязательное',
      selectList: [
        {name:'Нет угрозы ЧС', id:0},
        {name:'Угроза ЧС', id:1},
        {name:'ЧС', id:2}
      ],
      styleClass: 'col-4',
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
      type: 'mask',
      errorText: 'Обязательное',
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
      errorText: 'Обязательное',
      dropdownPosition: 'top',
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
      type: 'text',
      pattern: '^[0-9]*',
      errorText: 'Только числа',
      styleClass: 'col-3',
      additional: {
        block: 'patient'
      }
    },
    {
      label: 'Месяцев',
      key: 'ageMonths',
      type: 'text',
      pattern: '^[0-9]*',
      errorText: 'Только числа',
      styleClass: 'col-3',
      additional: {
        block: 'patient'
      }
    },
    {
      label: 'Дней',
      key: 'ageDays',
      type: 'text',
      pattern: '^[0-9]*',
      errorText: 'Только числа',
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
      label: '*Место вызова',
      key: 'placeTypeFK',
      type: 'dict',
      required: true,
      errorText: 'Обязательное',
      dict: 'getReferenceTypeListCallPlaceUsingGET',
      styleClass: 'col-5',
      additional: {
        block: 'address'
      }
    },
    {
      label: 'Район*',
      key: 'subdivisionFK',
      type: 'dict',
      dict: 'getSubdivisionListUsingGET',
      dictFilters: {type: [448641]},
      dictFiltersOrder: ['type'],
      required: true,
      errorText: 'Обязательное',
      styleClass: 'col-12',
      additional: {
        block: 'address'
      }
    },
  ];
  patients: { item: PatientTemplateBean, form: FormGroup, subscription: Subscription }[] = [];
  form: FormGroup;
  lockSettingPoint = true; // флаг - надо ли считывать клик с карты для сохранения координат вызова
  isEdit: boolean;
  tryToUnlock: boolean = false; // если получаем токен блокировки


  constructor(private route: ActivatedRoute,
              private router: Router,
              private user: UserService,
              private modal: NgbModal,
              private cmodal: CustomModalService,
              private ns: NotificationsService,
              public cs: CallItemService,
              private sds: SimpleDescriptionService,
              private logS: LogService,
              private ap: MedAudioPlayerService,
              private locksService: TeldaNgLocksService,
              private sTopics: SocketTopicsService,
              public access: RoleAccessService,
              private ms: MedMapService) {
  }

  ngOnInit() {
    this.sbscs.push(
      this.cs.callItemSub.subscribe(
        call => {
          console.log(call);
          this.callItem = call;
          let ukioCardS = localStorage.getItem('ukio'); //{performerId: number, sessionId: string, fromNumber: string, ukio: any}
         if (ukioCardS){
           let ukioCard:{performerId: number, sessionId: string, fromNumber: string, ukio: any}  = JSON.parse(ukioCardS);
           this.callItem.call.sessionId = ukioCard.sessionId;

           this.ns.success('', 'К вызову привязана сессия:' + this.callItem.call.sessionId)
         }
          this.callItem.brigadeList = this.callItem.brigadeList ? this.callItem.brigadeList : [];
          this.callItem.call.patientList = this.callItem.call.patientList ? this.callItem.call.patientList : [];
          this.form && this.form.reset(this.callItem.call);
          this.resetPatientList();
        }
      ),
      this.cs.isEditingSub.subscribe(
        editing => this.isEdit = editing
      ),
      this.sTopics.callStatusSub.subscribe(
        status => {
          if (status.callId === this.callItem.call.id) {
            this.callItem.call.status = status.callStatus;
          }
        }
      ),
      this.sTopics.callUpdatedSub.subscribe(
        update => {
          if (update.id === this.callItem.call.id) {
            console.log('needUpdate');
            this.cs.getCall(this.callItem.call.id).subscribe(()=> 'call updated');
          }
        }
      ),
      this.sTopics.updateUkioSub.subscribe(
        (ukio: {callId: number, subdivisionId: number, reasonForUpdate: string}) => {
          console.log('updated ukio', ukio);
          if (ukio.callId === this.callItem.call.id)
            this.ns.warn('Карточка УКИО обновлена', ukio.reasonForUpdate);
        }
      )
    );
    this.form = this.sds.makeForm(this.description);
    this.form.controls['typeFK'].valueChanges.subscribe( // Для отказа вызова
      el => {
        if (el.code === 'REJECT_CALL') {
          this.form.controls['reasonComment'].setValidators(Validators.required);
          if (!this.callItem.call.reasonComment) {
            this.form.controls['reasonComment'].reset(this.callItem.call.reasonComment);
            this.form.controls['reasonComment'].markAsTouched();
            this.ns.warn('Укажите причину отказа');
          }
        }
        else {
          this.form.controls['reasonComment'].setValidators(null);
          this.form.controls['reasonComment'].reset(this.callItem.call.reasonComment);
          this.form.controls['reasonComment'].markAsTouched();
        }
      }
    );
    console.log('-<', this.callItem.call);
    this.form.reset(this.callItem.call);
    this.form.disable();
  }


  resetPatientList(disableForm = true) {
    this.patients = [];
    this.callItem.call.patientList.forEach(
      (patient) => {
        let form = this.sds.makeForm(this.getBlockDescriptions('patient'));
        form.reset(patient);
        disableForm && form.disable();
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
    this.lockForm();
    this.sbscs.forEach(el => el.unsubscribe());
    this.patients.forEach(pat => pat.subscription.unsubscribe());
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
    if (this.form.invalid) {
      this.ns.error('Ошибка заполнения', 'Форма заполнена неверно');
      Object.keys(this.form.controls).forEach(control => this.form.controls[control].markAsTouched());
    } else {
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
            localStorage.removeItem('ukio');
            this.ns.success('Успешно', 'Данные сохранены');
          },
          err => {
            this.ns.error('Ошибка', 'Не удалось сохранить изменения на сервере');
            console.log('Save Call General', err);
          }
        )
      );
    }
  }

  unlockForm() {
    this.tryToUnlock = true;
    this.locksService.startLock(this.callItem.call.id).pipe(take(1)).subscribe(
      value => {
        this.tryToUnlock = false;
        if (value.result.success) {
          this.form.enable();
          this.patients.forEach(
            patient => patient.form.enable()
          );
          this.cs.startEditing();
        } else {
          this.ns.warn(null, `Вызов редактируется пользователем ${value.result.locker}`)
        }

      }
    );
  }

  lockForm() {
    this.tryToUnlock = true;
    this.locksService.unlock().pipe(take(1)).subscribe(
      value => {
        this.tryToUnlock = false;
        this.form.disable();
        this.patients.forEach(
          patient => patient.form.disable()
        );
        this.cs.endEditing();
      }
    );

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
    const av = this.modal.open(ModalAviationRequestComponent);
    av.componentInstance.call = this.callItem.call;
    av.result.then(
      result => {
        if (result) {
          this.cs.sendAviationRequest(result).subscribe(
            r => {
              console.log(r);
              this.cs.updateCall();
              this.ns.success('Успешно', 'Заявка оправлена!');
            },
            error1 => {
              console.log('Request error', error1);
              this.ns.error('Ошибка', 'Не удалось отправить заявку!');
            }
          );
        }
      },
      error => {
      }
    );

  }

  openAviaRequest() {
    const ri = this.modal.open(ModalAviaRequestInfoComponent);
    ri.componentInstance.reqItem = this.callItem.call.aviaRequest;
  }

  showLog() {
    this.logS.openLog(this.callItem.call.id, RecordType.CALL);
  }

  openPlayer() {
    this.ap.openPlayer(this.callItem.call.id)
  }

  openUkio() {
    this.router.navigate([`/info-exchange/ukio-messages/${this.callItem.call.ukioCardBean.cardID}`], {relativeTo: this.route});
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

  openPatientArchive(){
    const pa = this.modal.open(ModalCallPatientArchiveComponent, {size: 'lg'});
    pa.componentInstance.filter = this.patients[0].form.getRawValue();
    pa.result.then(
      (p: PatientBean) =>{
        p.ageYears = null;
        p.ageMonths = null;
        p.ageDays = null;
        if (new Date().getFullYear() - new Date(p.birthday).getFullYear() > 0){
          p.ageYears = new Date().getFullYear() - new Date(p.birthday).getFullYear();
        } else if (new Date().getMonth() - new Date(p.birthday).getMonth() > 0) {
          p.ageMonths = new Date().getMonth() - new Date(p.birthday).getMonth();
        } else if (new Date().getDate() - new Date(p.birthday).getDate() > 0) {
          p.ageDays = new Date().getDate() - new Date(p.birthday).getDate();
        }
        this.patients[0].form.reset(p);
      }
    );
  }

}
