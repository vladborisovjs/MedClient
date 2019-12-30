import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  ISimpleDescription,
  SimpleDescriptionService
} from '../../../shared/simple-control/services/simple-description.service';
import {FormGroup} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {CardItemService} from '../../services/card-item.service';
import {NotificationsService} from 'angular2-notifications';
import {Subscription} from 'rxjs';
import {ColDef} from 'ag-grid-community';
import {CardBean, TherapyBean} from '../../../../../swagger/med-api.service';
import {DatePipe} from '@angular/common';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CustomModalService} from '../../../shared/modal/services/custom-modal.service';
import {ModalMkb10DiagnosisComponent} from '../../../shared/modal-mkb10-diagnosis/components/modal-mkb10-diagnosis.component';
import {ModalCardResultTherapyWithBagComponent} from '../modal-card-result-therapy-with-bag/modal-card-result-therapy-with-bag.component';

@Component({
  selector: 'app-card-result',
  templateUrl: './card-result.component.html',
  styleUrls: ['./card-result.component.scss']
})
export class CardResultComponent implements OnInit, OnDestroy {
  datePipe = new DatePipe('ru');
  colDefs: ColDef[] = [
    {
      headerName: 'Дата',
      field: 'date',
      sortable: true,
      filter: true,
      sort: 'desc',
      valueFormatter: (p) => this.datePipe.transform(p.value, 'dd.MM.yyyy HH:mm'),
      width: 200
    },
    {
      headerName: 'Терапия',
      field: 'text',
      sortable: true,
      filter: true,
      width: 200
    },
    {
      headerName: 'Лекарственный препарат',
      width: 250,
      cellRenderer: params => {
        if (params.data.therapyItemList) {
          const drugs = params.data.therapyItemList.find((item) => item.drugFK !== null);
          console.log(drugs);
          return drugs ? drugs.drugFK.name : '';
        } else {
          return '';
        }
      }
    },
    {
      headerName: 'Медицинское изделие',
      width: 250,
      cellRenderer: params => {
        if (params.data.therapyItemList) {
          const wares = params.data.therapyItemList.find((item) => {
            return item.wareFK !== null;
          });
          return wares ? wares.wareFK.name : '';
        } else {
          return '';
        }
      }
    }
  ];
  sbscs: Subscription[] = [];
  cardItem: CardBean;
  mode: string = 'undef'; // режим отображения форм в зависимости от типа результата
  form: FormGroup;
  formType: FormGroup;
  currentBlock: any[];

  descriptionsType: ISimpleDescription [] = [
    {
      label: 'Тип: ',
      type: 'dict',
      key: 'resultTypeFK',
      required: true,
      errorText: 'Обязательное',
      dict: 'getReferenceTypeListResultUsingGET',
      styleClass: 'col-12',
      additional: {
        block: 'type'
      }
    },
  ];
  descriptions: ISimpleDescription [] = [
    {
      label: 'Время',
      key: 'deathTime',
      type: 'date',
      styleClass: 'line-form col-12',
      additional: {
        block: 'deathTime'
      }
    },
    {
      label: 'Откуда',
      type: 'dict',
      key: 'hospFromFK',
      styleClass: 'col-12',
      bindLabel: 'shortName',
      dict: 'getSubdivisionListUsingGET',
      dictFilters: {type: [1558]},
      dictFiltersOrder: ['type'],
      additional: {
        block: 'transporting'
      }
    },
    {
      label: 'Куда',
      type: 'dict',
      key: 'hospToFK',
      styleClass: 'col-12',
      bindLabel: 'shortName',
      dict: 'getSubdivisionListUsingGET',
      dictFilters: {type: [1558]},
      dictFiltersOrder: ['type'],
      additional: {
        block: 'transporting'
      }
    },
    {
      label: 'Способ',
      type: 'dict',
      key: 'transportationMethodFK',
      styleClass: 'col-6',
      dict: 'getReferenceTypeListTransportationMethodUsingGET',
      additional: {
        block: 'transporting'
      }
    },

    {
      label: 'Дата/Время',
      key: 'transportingDate',
      styleClass: 'col-6',
      type: 'date',
      additional: {
        block: 'transporting'
      }
    },
    {
      label: 'Осложнения при транспортировке',
      type: 'checkbox',
      key: 'hospComplications',
      additional: {
        block: 'transporting'
      }
    },
    {
      label: 'Комментарий',
      type: 'textarea',
      key: 'HospComplicationsText',
      additional: {
        block: 'transporting'
      }
    },
    {
      label: 'Бригада',
      type: 'text',
      key: 'transferPatientBrigade',
      additional: {
        block: 'transfer_patient'
      }
    },
    {
      label: 'Дата/Время',
      key: 'transferPatientDate',
      type: 'date',
      additional: {
        block: 'transfer_patient'
      }
    },
    {
      label: 'Основной',
      key: 'mainDiagnosisFK',
      type: 'dict',
      readonly: true,
      required: true,
      styleClass: 'col-10',
      additional: {
        block: 'diagnosis'
      }
    },
    {
      label: '',
      placeholder: 'Выбрать',
      key: '',
      type: 'btn',
      action: this.chooseMainDiagnosis.bind(this),
      btnClass: 'mt-4  btn btn-info',
      styleClass: 'col-2',
      additional: {
        block: 'diagnosis'
      }
    },
    {
      label: 'Сопутствующий',
      key: 'concomitantDiagnosisFK',
      type: 'dict',
      readonly: true,
      required: true,
      styleClass: 'col-10',
      additional: {
        block: 'diagnosis'
      }
    },
    {
      label: '',
      placeholder: 'Выбрать',
      key: '',
      type: 'btn',
      action: this.chooseConcomitantDiagnosis.bind(this),
      btnClass: 'mt-4  btn btn-info',
      styleClass: 'col-2',
      additional: {
        block: 'diagnosis'
      }
    },
    {
      label: 'Осложнения',
      key: 'complicationFK',
      type: 'dict',
      styleClass: 'col-6',
      dict: 'getReferenceTypeListComplicationsUsingGET',
      additional: {
        block: 'diagnosis'
      }
    },
    {
      label: 'Ритм',
      type: 'text',
      key: 'ekgRhytm',
      styleClass: 'line-form col-6',
      additional: {
        block: 'ekg'
      }
    },
    {
      label: 'ЧСС',
      type: 'number',
      key: 'ekgChSS',
      styleClass: 'line-form col-6',
      postLabel: 'в мин.',
      additional: {
        block: 'ekg'
      }
    },
    {
      label: 'Комментарии',
      type: 'textarea',
      key: 'ekgComments',
      rows: 4,
      additional: {
        block: 'ekg'
      }
    },
    {
      label: 'Кем',
      key: 'activeVisitFK',
      type: 'dict',
      dict: 'getReferenceTypeListActiveVisitUsingGET',
      styleClass: 'line-form col-5',
      additional: {
        block: 'activeVisitFK'
      }
    },
    {
      label: 'Через',
      type: 'text',
      pattern: '^[0-9]*',
      errorText: 'Только числа',
      key: 'activeVisitHours',
      styleClass: 'line-form col-6',
      postLabel: 'час',
      additional: {
        block: 'activeVisitFK'
      }
    },
    {
      label: 'Примечания',
      type: 'textarea',
      key: 'comments',
      rows: 4,
      additional: {
        block: 'comments'
      }
    },
    {
      label: 'ЧСС: ',
      key: 'transportChss',
      type: 'text',
      styleClass: 'line-form col-6',
      postLabel: 'в сек.',
      additional: {
        block: 'transport_efficiency_assistance'
      }
    },
    {
      label: 'PS: ',
      key: 'transportPulse',
      type: 'text',
      styleClass: 'line-form col-6',
      postLabel: 'в сек.',
      additional: {
        block: 'transport_efficiency_assistance'
      }
    },
    {
      label: 'АД: ',
      key: 'transportAd',
      type: 'text',
      styleClass: 'line-form col-6',
      postLabel: 'мм Hg.',
      additional: {
        block: 'transport_efficiency_assistance'
      }
    },
    {
      label: 'Рабочее АД: ',
      key: 'transportWorkAd',
      type: 'text',
      styleClass: 'line-form col-6',
      postLabel: 'мм Hg',
      additional: {
        block: 'transport_efficiency_assistance'
      }
    },
    {
      label: 't тела: ',
      key: 'transportTemperature',
      type: 'text',
      styleClass: 'line-form col-6',
      postLabel: '°С',
      additional: {
        block: 'transport_efficiency_assistance'
      }
    },
    {
      label: 'ЧД: ',
      key: 'transportChd',
      type: 'text',
      styleClass: 'line-form col-6',
      postLabel: 'в сек.',
      additional: {
        block: 'transport_efficiency_assistance'
      }
    },
    {
      label: 'Глюкометрия: ',
      key: 'transportGlucometry',
      type: 'text',
      styleClass: 'line-form col-6',
      postLabel: 'ммоль',
      additional: {
        block: 'transport_efficiency_assistance'
      }
    },
    {
      label: 'Sat O2: ',
      key: 'transportOximetry',
      type: 'text',
      styleClass: 'line-form col-6',
      postLabel: '%',
      additional: {
        block: 'transport_efficiency_assistance'
      }
    },
    {
      label: 'ЧСС: ',
      key: 'localChss',
      type: 'text',
      styleClass: 'line-form col-6',
      postLabel: 'в сек.',
      additional: {
        block: 'local_efficiency_assistance'
      }
    },
    {
      label: 'PS: ',
      key: 'localPulse',
      type: 'text',
      styleClass: 'line-form col-6',
      postLabel: 'в сек.',
      additional: {
        block: 'local_efficiency_assistance'
      }
    },
    {
      label: 'АД: ',
      key: 'localAd',
      type: 'text',
      styleClass: 'line-form col-6',
      postLabel: 'мм Hg.',
      additional: {
        block: 'local_efficiency_assistance'
      }
    },
    {
      label: 'Рабочее АД: ',
      key: 'localWorkAd',
      type: 'text',
      styleClass: 'line-form col-6',
      postLabel: 'мм Hg',
      additional: {
        block: 'local_efficiency_assistance'
      }
    },
    {
      label: 't тела: ',
      key: 'localTemperature',
      type: 'text',
      styleClass: 'line-form col-6',
      postLabel: '°С',
      additional: {
        block: 'local_efficiency_assistance'
      }
    },
    {
      label: 'ЧД: ',
      key: 'localChd',
      type: 'text',
      styleClass: 'line-form col-6',
      postLabel: 'в сек.',
      additional: {
        block: 'local_efficiency_assistance'
      }
    },
    {
      label: 'Глюкометрия: ',
      key: 'localGlucometry',
      type: 'text',
      styleClass: 'line-form col-6',
      postLabel: 'ммоль',
      additional: {
        block: 'local_efficiency_assistance'
      }
    },
    {
      label: 'Sat O2: ',
      key: 'localPulseOximetry',
      type: 'text',
      styleClass: 'line-form col-6',
      postLabel: '%',
      additional: {
        block: 'local_efficiency_assistance'
      }
    },
    {
      label: 'Ритм',
      type: 'text',
      key: 'ekgRhytmAfter',
      styleClass: 'line-form col-12',
      additional: {
        block: 'ekg_after'
      }
    },
    {
      label: 'ЧСС',
      type: 'number',
      key: 'ekgChSSAfter',
      styleClass: 'line-form col-12',
      postLabel: 'в мин',
      additional: {
        block: 'ekg_after'
      }
    },
    {
      label: 'Комментарии',
      type: 'textarea',
      key: 'ekgCommentsAfter',
      rows: 4,
      additional: {
        block: 'ekg_after'
      }
    },
    {
      label: 'Результат мероприятий: ',
      type: 'dict',
      key: 'complicationHelpFK',
      dict: 'getReferenceTypeListComplicationsHelpUsingGET',
      styleClass: 'col-12',
      additional: {
        block: 'assistance_result'
      }
    },
    {
      label: 'Место оказания помощи',
      type: 'select',
      selectList: [
        {id: true, name: 'В городе'},
        {id: false, name: 'В сельской местности'},
      ],
      key: 'helpInCity',
      additional: {
        block: 'assistance_result'
      }
    },
  ];

  blocks = {
    noBlocks: {
      arrBlock: []
    },
    general: {
      arrBlock: [
        {label: 'Диагноз', block: 'diagnosis'},
        {label: 'Активное посещение', block: 'activeVisitFK'},
        {label: 'ЭКГ', block: 'ekg'}
      ]
    },
    transport: {
      arrBlock: [
        {label: 'Диагноз', block: 'diagnosis'},
        {label: 'ЭКГ', block: 'ekg'},
        {label: 'Транспортировка', block: 'transporting'}
      ]
    },
    transfer: {
      arrBlock: [
        {label: 'Диагноз', block: 'diagnosis'},
        {label: 'Активное посещение', block: 'activeVisitFK'},
        {label: 'ЭКГ', block: 'ekg'},
        {label: 'Передача спецбригаде', block: 'transfer_patient'}
      ]
    },
    deathTime: {
      arrBlock: [
        {label: 'смерть', block: 'deathTime'},
        {label: 'Диагноз', block: 'diagnosis'},
        {label: 'Транспортировка', block: 'transporting'}
      ]
    },
    undef: {
      arrBlock: []
    }
  };
  localTherapies: TherapyBean[] = [];
  transportTherapies: TherapyBean[] = [];


  constructor(private route: ActivatedRoute,
              private cas: CardItemService,
              private ns: NotificationsService,
              private modal: NgbModal,
              private modalInstance: NgbActiveModal,
              private cmodal: CustomModalService,
              private sds: SimpleDescriptionService) {
  }

  ngOnInit() {
    this.form = this.sds.makeForm(this.descriptions);
    this.formType = this.sds.makeForm(this.descriptionsType);
    this.sbscs.push(
      this.cas.isEditingSub.subscribe(s => {
        if (s === 'disable' || s === 'loading') {
          this.form.disable({emitEvent: false});
          this.formType.disable({emitEvent: false});
        } else {
          this.form.enable({emitEvent: false});
          this.formType.enable({emitEvent: false});
        }
      }),
      this.cas.cardItemSub.subscribe(cardItem => {
        this.cardItem = cardItem;
        this.formType.reset(this.cardItem);
        if (this.cardItem.resultTypeFK) {
          this.setMode(this.cardItem.resultTypeFK.id);
        }
        this.resetTherapies();
      }),
      this.form.valueChanges.subscribe(
        result => {
          Object.assign(this.cardItem.cardResultBean, result);
          // this.blocks = { // todo: сделать функцию апдейта блоков, получать блоки из функции (в html тоже)
          //   noBlocks: {
          //     arrBlock: []
          //   },
          //   general: {
          //     arrBlock: [
          //       {label: 'Диагноз', block: 'diagnosis'},
          //       {label: 'Активное посещение', block: 'activeVisitFK'},
          //       {label: 'ЭКГ', block: 'ekg'}
          //     ]
          //   },
          //   transport: {
          //     arrBlock: [
          //       {label: 'Диагноз', block: 'diagnosis'},
          //       {label: 'ЭКГ', block: 'ekg'},
          //       {label: 'Транспортировка', block: 'transporting'}
          //     ]
          //   },
          //   transfer: {
          //     arrBlock: [
          //       {label: 'Диагноз', block: 'diagnosis'},
          //       {label: 'Активное посещение', block: 'activeVisitFK'},
          //       {label: 'ЭКГ', block: 'ekg'},
          //       {label: 'Передача спецбригаде', block: 'transfer_patient'}
          //     ]
          //   },
          //   deathTime: {
          //     arrBlock: [
          //       {label: 'смерть', block: 'deathTime'},
          //       {label: 'Диагноз', block: 'diagnosis'},
          //       {label: 'Транспортировка', block: 'transporting'}
          //     ]
          //   },
          //   undef: {
          //     arrBlock: []
          //   }
          // };
        }
      ),
      this.formType.valueChanges.subscribe(
        ch => {
          Object.assign(this.cardItem, ch);
          if (this.cardItem.resultTypeFK) {
            this.setMode(this.cardItem.resultTypeFK.id);
          }
        }
      )
    );
    this.form.reset(this.cardItem.cardResultBean);
  }

  ngOnDestroy() {
    this.sbscs.forEach(el => el.unsubscribe());
  }

  resetTherapies() {  // формирование и обновление списков терапий
    this.localTherapies = this.cardItem.cardResultBean.therapyList.filter(
      t => t.isLocal
    );
    this.transportTherapies = this.cardItem.cardResultBean.therapyList.filter(
      t => !t.isLocal
    );
  }

  getCurrentBlock(mode: string) {
    this.currentBlock = this.blocks[mode].arrBlock;
  }

  setMode(typeId) {
    console.log(typeId);
    switch (typeId) {
      case 0:
        this.mode = 'noBlocks';
        this.getCurrentBlock(this.mode);
        break;
      case 445331:
      case 445326:
      case 445313:
      case 337736: // оказана помощь,
      case 445314:
        this.mode = 'general';
        this.getCurrentBlock(this.mode);
        break;
      case 445330:
      case 445308:
      case 445322:
      case 445318:
        this.mode = 'transport';
        this.getCurrentBlock(this.mode);
        break;
      case 445310:
      case 445320:
        this.mode = 'transfer';
        this.getCurrentBlock(this.mode);
        break;
      case 445319:
      case 457562:
      case 458619:
      case 457564:
        this.mode = 'deathTime';
        this.getCurrentBlock(this.mode);
        break;
      default:
        this.mode = 'undef';
        this.getCurrentBlock(this.mode);
    }
  }

  editTherapyWithBag(therapy: TherapyBean) {
    const thModal = this.modal.open(ModalCardResultTherapyWithBagComponent);
    thModal.componentInstance.therapy = therapy;
    thModal.result.then(
      (_therapy: TherapyBean) => {
        therapy = _therapy;
        this.resetTherapies();
      },
      error => {
      }
    );
  }

  createTherapyWithBag(location: 'local' | 'transport',) {
    const thModal = this.modal.open(ModalCardResultTherapyWithBagComponent);
    thModal.result.then(
      (_therapy: TherapyBean) => {
        _therapy.isLocal = location === 'local';
        _therapy.resultId = this.cardItem.cardResultBean.id;
        _therapy.isDeleted = false;
        this.cardItem.cardResultBean.therapyList.push(_therapy);
        this.resetTherapies();
      },
      error => {
      }
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

  chooseMainDiagnosis() {
    const chooseDiagnosis = this.modal.open(ModalMkb10DiagnosisComponent, {size: 'lg', backdrop: 'static'});
    chooseDiagnosis.result.then(
      res => {
        if (res) {
          console.log(res);
          this.form.controls['mainDiagnosisFK'].setValue(res);
        }
      }, () => {
      }
    );
  }

  chooseConcomitantDiagnosis() {
    const chooseConcomitantDiagnosis = this.modal.open(ModalMkb10DiagnosisComponent, {size: 'lg', backdrop: 'static'});
    chooseConcomitantDiagnosis.result.then(
      res => {
        if (res) {
          console.log(res);
          this.form.controls['concomitantDiagnosisFK'].setValue(res);
        }
      }, () => {
      }
    );
  }
}
