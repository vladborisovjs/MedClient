import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {CallsService} from '../../services/calls.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {
  ISimpleDescription,
  SimpleDescriptionService
} from '../../../shared/simple-control/services/simple-description.service';
import {FormGroup} from '@angular/forms';
import {
  CallContainer,
  PatientBean,
  PatientTemplateBean
} from '../../../../../swagger/med-api.service';
import {NotificationsService} from 'angular2-notifications';
import {interval, Subscription} from 'rxjs';

import {ModalCallInquirerComponent} from '../modal-call-inquirer/modal-call-inquirer.component';
import {ActivatedRoute, Router} from '@angular/router';
import {MedMapService} from '../../../shared/best-map/services/med-map.service';
import {DatePipe} from '@angular/common';
import {ColDef} from 'ag-grid-community';
import {debounce, tap} from 'rxjs/operators';
import {IGridTableDataSource} from '../../../shared/grid-table/components/grid-table/grid-table.component';
import {Hotkey, HotkeysService} from 'angular2-hotkeys';
import {ModalCallPatientArchiveComponent} from "../modal-call-patient-archive/modal-call-patient-archive.component";
import {FullnameShorterPipe} from "../../../shared/med-pipes/pipes/fullname-shorter.pipe";
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'app-modal-create-call',
  templateUrl: './new-call.component.html',
  styleUrls: ['./new-call.component.scss'],
  providers: [MedMapService]
})
export class NewCallComponent implements OnInit, OnDestroy {
  form: FormGroup;

  enableSettingPoint = false;
  hotkeys: Hotkey[] = [
    new Hotkey('shift+s', () => {
      if (this.form.valid) {
        this.create();
      }
      return false;
    }),
  ];

  incomingCall: any; // данные звонка из localStorage
  isCreating: boolean; // флаг нажатия кнопки создать

  dataSource: IGridTableDataSource = {
    get: (filter, offset, count) => {
      this.repeatedCallItem = null;
      return this.calls.getRepeatedCalls(offset, count, filter);
    }
  };

  descriptions: ISimpleDescription[] = [
    {
      label: 'Тип*',
      key: 'typeFK',
      type: 'dict',
      required: true,
      dict: 'getReferenceTypeListRingTypeUsingGET',
      styleClass: 'col-3',
      errorText: 'Обязательное',
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
      selectList: this.calls.mode === 'tcmk' ? [
          {name: 'Экстренный', id: 1},
        ]
        :
        [
          {name: 'Экстренный', id: 1},
          {name: 'Неотложный', id: 0},
        ],
      styleClass: 'col-3',
      additional: {
        block: 'general'
      }
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
      key: '',
      type: 'btn',
      action: this.ask.bind(this),
      btnClass: 'mt-4 btn btn-info full-width',
      styleClass: 'col-2',
      additional: {
        block: 'general'
      }
    },

    {
      label: 'Описание',
      key: 'reasonComment',
      type: 'textarea',
      additional: {
        block: 'general'
      }
    },
    {
      label: 'Признак ЧС*',
      key: 'emergencySituation',
      type: 'select',
      required: true,
      errorText: 'Обязательное',
      selectList: [
        {name: 'Нет угрозы ЧС', id: 0},
        {name: 'Угроза ЧС', id: 1},
        {name: 'ЧС', id: 2}
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
      required: true,
      errorText: 'Обязательное',
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
      styleClass: 'col-3',
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
      styleClass: 'col-3',
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
      label: 'Место вызова*',
      key: 'placeTypeFK',
      type: 'dict',
      required: true,
      errorText: 'Обязательное',
      dict: 'getReferenceTypeListCallPlaceUsingGET',
      styleClass: 'col-3',
      additional: {
        block: 'address'
      }
    },
    {
      label: 'Район*',
      key: 'subdivisionFK',
      type: 'dict',
      dict: 'getSubdivisionListUsingGET',
      required: true,
      errorText: 'Обязательное',
      dictFilters: {type: [448641]},
      dictFiltersOrder: ['type'],
      styleClass: 'col-12',
      additional: {
        block: 'address'
      }
    },
  ];
  callItem: CallContainer = CallContainer.fromJS({
    call: {
      id: 0,
      patientList: [],
      subdivisionFK: this.user.mePerformer.performer.subdivisionFK,
      emergencySituation: 0
    }
  });
  patients: { item: PatientTemplateBean, form: FormGroup, subscription: Subscription }[] = [];
  sbscs: Subscription[] = [];
  filterRepeatedCalls = {
    repeatedCall: false
  };
  repeatedCallItem: any;
  colDefs: ColDef[] = [
    {
      headerName: 'Дата',
      field: 'date',
      sortable: true,
      filter: true,
      valueFormatter: (p) => {
        return this.dateFormatter(p);
      },
      width: 180
    },
    // {
    //   headerName: 'Заявитель',
    //   field: 'declarantName',
    //   sortable: true,
    //   filter: true,
    //   width: 200,
    // },
    {
      headerName: 'Адрес',
      field: 'address',
      filter: true,
      sortable: false,
      width: 220,
    },
    {
      headerName: 'Пациенты',
      field: 'patientList',
      sortable: false,
      filter: true,
      width: 250,
      valueGetter: params => {
        if (params.data.patientList && params.data.patientList.length) {
          let pat = '';
          if (!params.data.patientList[0].call) {
            return ' ';
          }
          pat = this.nameShorterPipe.transform(params.data.patientList);
          return pat;
        } else {
          return ' ';
        }

      },
    },
  ];
  datePipe = new DatePipe('ru');
  nameShorterPipe = new FullnameShorterPipe();
  coordinates = [0,0];

  dateFormatter(params) {
    return params.value ? this.datePipe.transform(params.value, 'dd.MM.yyyy HH:mm') : '-';
  }

  constructor(
    private calls: CallsService,
    private modal: NgbModal,
    private sds: SimpleDescriptionService,
    private ns: NotificationsService,
    private router: Router,
    private route: ActivatedRoute,
    private ms: MedMapService,
    private hotkeysService: HotkeysService,
    private user: UserService
  ) {
    this.hotkeys.forEach(key => this.hotkeysService.add(key));
  }

  ngOnInit() {
    this.form = this.sds.makeForm(this.descriptions);

    const incomingS = localStorage.getItem('incoming'); // Новый вызов после звонка по телефону
    if (incomingS) {
      this.incomingCall = JSON.parse(incomingS);
      this.callItem.call.declarantPhone = this.incomingCall.fromNumber;
      this.callItem.call.sessionId = this.incomingCall.sessionId;
      this.ns.success('Предзаполнение', `Сессия: ${this.incomingCall.sessionId}`);
    }

    this.callItem.call.subdivisionFK = this.user.mePerformer.performer.subdivisionFK;
    this.form.reset(this.callItem.call, {emitEvent: false});

    this.sbscs.push(
      this.form.controls[`typeFK`].valueChanges.subscribe( // для похожих вызовов
        type => {
          this.filterRepeatedCalls.repeatedCall = type.code === 'REPEATED';
          this.filterRepeatedCalls = Object.assign({}, this.filterRepeatedCalls);
        }
      ),
      this.form.controls['declarantName'].valueChanges.subscribe( // фио с большой буквы
        decName => {
          let newDecName: string;
          if (decName) {
            console.log(decName[0].toLocaleUpperCase() + decName.slice(1));
            newDecName = decName.split(/\s+/).map(word => {
              if (word[0]) {
                console.log(word[0]);
                return word[0].toUpperCase() + word.slice(1)
              }
            }).join(' ');
          }
          this.form.controls['declarantName'].reset(newDecName, {emitEvent: false});
        }
      )
    );
    this.checkPatientsLength();
    this.getRepeatedCalls();
  }

  ngOnDestroy() {
    this.sbscs.forEach(el => el.unsubscribe());
  }

  initMapPoint() {
    this.ms.setDefaultView();
  }

  setCallLocation(geometry) {
    this.callItem.call.location = JSON.stringify(geometry);
  }

  setLocationFromClick(geometry) {
    if (this.enableSettingPoint) {
      this.setCallLocation(geometry);
      this.ms.setPointLonLat(geometry);
      this.coordinates = JSON.parse(this.callItem.call.location).coordinates;
    }
  }

  setAddressPoint(geometry) {
    this.setCallLocation(this.ms.setPointLonLat(JSON.parse(geometry)));
    this.coordinates = JSON.parse(this.callItem.call.location).coordinates;
    this.ms.setMapViewOnPoint(JSON.parse(geometry));
  }
  setLocationFromInput(geometry) {
    if (this.enableSettingPoint) {
      this.callItem.call.location = JSON.stringify(geometry);
      this.ms.setPointLonLat(geometry);
      this.ms.setMapViewOnPoint(geometry);
      this.coordinates = JSON.parse(this.callItem.call.location).coordinates;
    }
  }
  deleteCoordinates() {
    this.callItem.call.location = null;
    this.ms.drawPoint([0,0]);
    this.ms.setDefaultView();
  }

  // опрос повода к вызову
  ask() {
    const askWin = this.modal.open(ModalCallInquirerComponent);
    askWin.result.then(res => {
      if (res) {
        console.log('опросили', res);
        this.form.controls[`reasonFK`].setValue(res);
      }
    });
  }

  addPatient() {
    const form = this.sds.makeForm(this.getBlockDescriptions('patient'));
    const item = PatientBean.fromJS({isDeleted: false, id: 0});
    const subscription = form.valueChanges.subscribe(ch => {
      Object.assign(item, ch);
    });
    this.patients.push(
      {
        item: item,
        form: form,
        subscription: subscription
      }
    );
    ['name', 'surname', 'patronymic'].forEach(
      key => {
        this.sbscs.push(
          form.controls[key].valueChanges.subscribe(
            name => {
              if (name) {
                form.controls[key].reset(
                  name[0].toLocaleUpperCase() + name.slice(1), {emitEvent: false}
                  );
              }
            }
          )
        );
      }
    );
    this.getRepeatedCalls();
  }

  // selectedRepeateCall(e) {
  //   this.calls.getCall(e.data.id).subscribe(
  //     rep => {
  //       this.setRepeatedCall(rep);
  //       this.refreshForms();
  //     }
  //   );
  // }

  getRepeatedCalls() {
    if (this.patients.length) {
      this.patients[0].form.valueChanges
        .pipe(debounce(() => interval(300)))
        .subscribe(
          el => {
            this.filterRepeatedCalls = el;
          }
        );
    }
  }

  setRepeatedCall(rep) {
    Object.assign(this.callItem.call, rep.data, {id: 0, typeFK: this.callItem.call.typeFK, aviaRequest: null});
    if (rep.data.location) {
      this.ms.setPointLonLat(JSON.parse(rep.data.location));
      this.ms.setMapViewOnPoint(JSON.parse(rep.data.location));
    }
    this.setPatients();
    this.refreshForms();
  }

  refreshForms() {
    this.form.reset(this.callItem.call);
    for (let i = 0; i < this.callItem.call.patientList.length; i++) {
      this.patients[i].form.reset(this.callItem.call.patientList[i]);
    }
  }

  deletePatient(i) {
    this.patients[i].form.reset(this.callItem.call.patientList);
    this.patients[i].subscription.unsubscribe();
    this.patients.splice(i, 1);
    this.getRepeatedCalls();
  }

  checkPatientsLength() {
    if (!this.patients.length) {
      this.addPatient();
    }
  }

  setPatients() {
    if (this.callItem.call.patientList.length) {
      this.patients = [];
      for (let i = 0; i < this.callItem.call.patientList.length; i++) {
        this.addPatient();
      }
    }
  }

  create() {
    this.isCreating = true;
    if (this.form.invalid) {
      this.ns.error('Ошибка заполнения', 'Форма заполнена неверно');
      Object.keys(this.form.controls).forEach(control => this.form.controls[control].markAsTouched());
      this.isCreating = false;
    } else {
      this.callItem.call.patientList = this.patients.map(
        pat => pat.item
      );
      this.patients.forEach(pat => pat.subscription.unsubscribe());
      Object.assign(this.callItem.call, this.form.getRawValue());
      console.log(this.callItem);
      this.sbscs.push(
        this.calls.createCall(this.callItem).subscribe(
          res => {
            this.isCreating = false;
            localStorage.removeItem('incoming');
            this.ns.success('Успешно', `Создан вызов №${res.call.number}`);
            this.router.navigate([`../${res.call.id}`], {relativeTo: this.route});
          },
          err => {
            this.isCreating = false;
            this.ns.error('Ошибка', 'Не удалось сохранить изменения на сервере');
            console.log('Save new call', err);
          }
        )
      );
    }

  }

  getBlockDescriptions(block: string): ISimpleDescription[] {
    return this.descriptions.filter(el => {
      if (el.additional) {
        return el.additional.block === block;
      }
      return false;
    });
  }

  resize(e) {
    this.ms.resizeMap();
  }

  fitCol(e) {
    e.api.sizeColumnsToFit();
  }

  selectRepCall(e) {
    this.repeatedCallItem = e.data;
  }

  openRepCall() {
    window.open(`#/calls/${this.repeatedCallItem.id}`);
  }


  openPatientArchive() {
    const pa = this.modal.open(ModalCallPatientArchiveComponent, {size: 'lg'});
    pa.componentInstance.filter = this.patients[0].form.getRawValue();
    pa.result.then(
      (p: PatientBean) => {
        p.ageYears = null;
        p.ageMonths = null;
        p.ageDays = null;
        if (new Date().getFullYear() - new Date(p.birthday).getFullYear() > 0) {
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
