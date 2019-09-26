import {Component, OnDestroy, OnInit} from '@angular/core';
import {CallsService} from '../../services/calls.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {FormGroup} from '@angular/forms';
import {CallContainer, PatientBean, PatientTemplateBean} from '../../../../../swagger/med-api.service';
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

@Component({
  selector: 'app-modal-create-call',
  templateUrl: './new-call.component.html',
  styleUrls: ['./new-call.component.scss'],
  providers: [MedMapService]
})
export class NewCallComponent implements OnInit, OnDestroy {
  form: FormGroup;
  descriptions: ISimpleDescription[] = [
    {
      label: 'Тип*',
      key: 'typeFK',
      type: 'dict',
      required: true,
      dict: 'getReferenceTypeListRingTypeUsingGET',
      styleClass: 'col-3',
      errorText: 'Поле не может быть пустым',
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
      btnClass: 'mt-4 btn btn-info',
      styleClass: 'col-1',
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
    // {
    //   label: 'Корпус',
    //   key: 'building',
    //   type: 'text',
    //   styleClass: 'col-2',
    //   additional: {
    //     block: 'address'
    //   }
    // },
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
      label: 'Место вызова',
      key: 'placeTypeFK',
      type: 'dict',
      dict: 'getReferenceTypeListCallPlaceUsingGET',
      styleClass: 'col-3',
      additional: {
        block: 'address'
      }
    }
  ];
  callItem: CallContainer =  CallContainer.fromJS({call: {id: 0, patientList: []}});
  patients: {item: PatientTemplateBean, form: FormGroup, subscription: Subscription}[] = [];
  sbscs: Subscription[] = [];
  filterRepeatedCalls: any = {};
  loading: boolean;
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
    {
      headerName: 'Заявитель',
      field: 'declarantName',
      sortable: true,
      filter: true,
      width: 200,
    },
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
          params.data.patientList.forEach(
            p => {
              pat = pat + p.surname + ' ' + p.name + ', ';
            }
          );
          pat = pat.slice(0, -2);
          return pat;
        } else {
          return ' ';
        }

      },
    },
    {
      headerName: 'Бригады',
      field: 'brigades',
      sortable: false,
      filter: true,
      width: 180,
      valueGetter: params => {
        if (!params.data.assignedBrigadeList[0].call) {
          return ' ';
        }
        let bris = '';
        params.data.assignedBrigadeList.forEach(
          b => {
            bris = bris + b.brigadeFK.name + ', ';
          }
        );
        bris = bris.slice(0, -2);
        return bris;
      },
    },
  ];
  datePipe = new DatePipe('ru');
  dateFormatter(params) {
    return params.value ? this.datePipe.transform(params.value, 'dd.MM.yyyy HH:mm') : '-';
  }
  enableSettingPoint = false;
  hotkeys: Hotkey[] = [
    new Hotkey('shift+s', () => {
      if (this.form.valid){
        this.create();
      }
      return false;
    }),
  ];

  dataSource: IGridTableDataSource;
  constructor(
    private calls: CallsService,
    private modal: NgbModal,
    private sds: SimpleDescriptionService,
    private ns: NotificationsService,
    private router: Router,
    private route: ActivatedRoute,
    private ms: MedMapService,
    private hotkeysService: HotkeysService,
    ) {
    this.hotkeys.forEach(key => this.hotkeysService.add(key));
  }

  ngOnInit() {
    this.form = this.sds.makeForm(this.descriptions);
    this.checkPatientsLength();
    this.updateDataSource();
    this.getRepeatedCalls();
  }

  ngOnDestroy() {
    this.sbscs.forEach( el => el.unsubscribe());
  }

  updateDataSource() {
    this.dataSource = {
      get: (filter, offset, count) => {
        this.loading = true;
        return this.calls.getRepeatedCalls(offset, count, filter.order, filter.isAsc, filter.name, filter.surname, filter.patronymic).pipe(tap(() => this.loading = false));
      }
    };
    return this.dataSource;
  }

  initMapPoint(){
    this.ms.setDefaultView();
  }

  setCallLocation(geometry){
    this.callItem.call.location = JSON.stringify(geometry);
  }

  setLocationFromClick(geometry){
    if (this.enableSettingPoint) {
      this.setCallLocation(geometry);
      this.ms.setPointLonLat(geometry);
    }
  }

  setAddressPoint(geometry){
    this.setCallLocation(this.ms.setPoint(JSON.parse(geometry)));
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
    let form = this.sds.makeForm(this.getBlockDescriptions('patient'));
    let item = PatientBean.fromJS({isDeleted: false, id: 0});
    let subscription = form.valueChanges.subscribe(ch => {Object.assign(item, ch);});
    this.patients.push(
      {
        item: item,
        form: form,
        subscription: subscription
      }
    );
    this.getRepeatedCalls();
  }

  selectedRepeateCall(e) {
    this.calls.getCall(e.data.id).subscribe(
      rep => {
        this.setRepeatedCall(rep);
        this.refreshForms();
      }
    );
  }

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
    this.checkPatientsLength();
    Object.assign(this.callItem.call, rep.call);
    this.ms.setPointLonLat(JSON.parse(rep.call.location));
    this.ms.setMapViewOnPoint(JSON.parse(rep.call.location));
  }

  resetForms() {
    this.patients[0].form.reset(this.callItem.call.patientList);
    this.form.reset();
  }

  refreshForms() {
    this.form.reset(this.callItem.call);
    this.patients[0].form.reset(this.callItem.call.patientList[0]);
  }

  deletePatient(i) {
    if (this.patients.length === 1) {
        this.resetForms();
    }
    this.patients[i].subscription.unsubscribe();
    this.patients.splice(i, 1);
    this.getRepeatedCalls();
    // this.checkPatientsLength();
  }

  checkPatientsLength() {
    if (!this.patients.length) {
      this.addPatient();
    }
  }
  create() {
    this.callItem.call.patientList = this.patients.map(
      pat => pat.item
    );
    this.patients.forEach(pat => pat.subscription.unsubscribe());
    Object.assign(this.callItem.call, this.form.getRawValue());
    this.sbscs.push(
      this.calls.createCall(this.callItem).subscribe(
        res => {
          this.ns.success('Успешно', `Создан вызов №${res.call.id}`);
          this.router.navigate([`../${res.call.id}`], {relativeTo: this.route});
        },
        err => {
          this.ns.error('Ошибка', 'Не удалось сохранить изменения на сервере');
          console.log('Save new call', err);
        }
      )
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

  resize(e) {
    this.ms.resizeMap();
  }

  fitCol(e) {
    e.api.sizeColumnsToFit();
  }

}
