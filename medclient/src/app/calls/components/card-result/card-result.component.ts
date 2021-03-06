import {Component, OnDestroy, OnInit} from '@angular/core';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {FormGroup} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {CardItemService} from '../../services/card-item.service';
import {NotificationsService} from 'angular2-notifications';
import {Subscription} from 'rxjs';
import {ColDef} from 'ag-grid-community';
import {
  CardBean,
  CardResultBean,
  CardResultDto,
  CardResultDtoFLAT,
  MedApi,
  ReferenceTypeBean,
  TherapyDto
} from '../../../../../swagger/med-api.service';
import {DatePipe} from '@angular/common';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalAddTherapyComponent} from '../modal-add-therapy/modal-add-therapy.component';
import {CustomModalService} from '../../../shared/modal/services/custom-modal.service';
import {ModalCallInquirerComponent} from '../modal-call-inquirer/modal-call-inquirer.component';
import {ModalMkb10DiagnosisComponent} from '../modal-mkb10-diagnosis/modal-mkb10-diagnosis.component';

@Component({
  selector: 'app-card-result',
  templateUrl: './card-result.component.html',
  styleUrls: ['./card-result.component.scss']
})
export class CardResultComponent implements OnInit, OnDestroy {
  datePipe = new DatePipe('ru');
  therapies: TherapyDto;
  colDefs: ColDef[] = [
    {
      headerName: 'Дата',
      field: 'date',
      sortable: true,
      filter: true,
      valueFormatter: (p) => this.datePipe.transform(p.value, 'dd.MM.yyyy HH:mm'),
      width: 200
    },
    {
      headerName: 'Терапия',
      field: 'text',
      sortable: true,
      filter: true,
      width: 500
    }
  ];
  listLocal: any[] = [];
  listTransport: any[] = [];
  selectedTherapy: any;
  sbscs: Subscription[] = [];
  objective: CardBean;
  mode: string = 'undef';
  form: FormGroup;
  formType: FormGroup;
  descriptionsType: ISimpleDescription [] = [
    {
      label: 'Тип: ',
      type: 'dict',
      key: 'resultTypeFK',
      required: true,
      errorText: 'Поле не может быть пустым',
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
      label: 'Способ',
      type: 'dict',
      key: 'transportationMethodFK',
      dict: 'getReferenceTypeListTransportationMethodUsingGET',
      additional: {
        block: 'transporting'
      }
    },
    {
      label: 'Куда',
      type: 'dict',
      key: 'hospToFK',
      dict: 'getSubdivisionListUsingGET',
      additional: {
        block: 'transporting'
      }
    },
    {
      label: 'Дата/Время',
      key: 'transportingDate',
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
      key: 'mkbFK',
      type: 'dict',
      readonly: true,
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
      dict: 'getReferenceTypeListComplicationsUsingGET',
      additional: {
        block: 'diagnosis'
      }
    },
    {
      label: 'Ритм',
      type: 'number',
      pattern: '^[0-9]*',
      errorText: 'Поле не может быть отрицательным',
      key: 'ekgRhytm',
      styleClass: 'line-form col-6',
      additional: {
        block: 'ekg'
      }
    },
    {
      label: 'ЧСС',
      type: 'number',
      pattern: '^[0-9]*',
      errorText: 'Поле не может быть отрицательным',
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
      type: 'number',
      pattern: '^[0-9]*',
      errorText: 'Поле не может быть отрицательным',
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
      type: 'number',
      pattern: '^[0-9]*',
      errorText: 'Поле не может быть отрицательным',
      styleClass: 'line-form col-6',
      postLabel: 'в сек.',
      additional: {
        block: 'transport_efficiency_assistance'
      }
    },
    {
      label: 'PS: ',
      key: 'transportPulse',
      type: 'number',
      pattern: '^[0-9]*',
      errorText: 'Поле не может быть отрицательным',
      styleClass: 'line-form col-6',
      postLabel: 'в сек.',
      additional: {
        block: 'transport_efficiency_assistance'
      }
    },
    {
      label: 'АД: ',
      key: 'transportAd',
      type: 'number',
      pattern: '^[0-9]*',
      errorText: 'Поле не может быть отрицательным',
      styleClass: 'line-form col-6',
      postLabel: 'мм Hg.',
      additional: {
        block: 'transport_efficiency_assistance'
      }
    },
    {
      label: 'Рабочее АД: ',
      key: 'transportWorkAd',
      type: 'number',
      pattern: '^[0-9]*',
      errorText: 'Поле не может быть отрицательным',
      styleClass: 'line-form col-6',
      postLabel: 'мм Hg',
      additional: {
        block: 'transport_efficiency_assistance'
      }
    },
    {
      label: 't тела: ',
      key: 'transportTemperature',
      type: 'number',
      pattern: '^[0-9]*',
      errorText: 'Поле не может быть отрицательным',
      styleClass: 'line-form col-6',
      postLabel: '°С',
      additional: {
        block: 'transport_efficiency_assistance'
      }
    },
    {
      label: 'ЧД: ',
      key: 'transportChd',
      type: 'number',
      pattern: '^[0-9]*',
      errorText: 'Поле не может быть отрицательным',
      styleClass: 'line-form col-6',
      postLabel: 'в сек.',
      additional: {
        block: 'transport_efficiency_assistance'
      }
    },
    {
      label: 'Глюкометрия: ',
      key: 'transportGlucometry',
      type: 'number',
      pattern: '^[0-9]*',
      errorText: 'Поле не может быть отрицательным',
      styleClass: 'line-form col-6',
      postLabel: 'ммоль',
      additional: {
        block: 'transport_efficiency_assistance'
      }
    },
    {
      label: 'Sat O2: ',
      key: 'transportOximetry',
      type: 'number',
      pattern: '^[0-9]*',
      errorText: 'Поле не может быть отрицательным',
      styleClass: 'line-form col-6',
      postLabel: '%',
      additional: {
        block: 'transport_efficiency_assistance'
      }
    },
    {
      label: 'ЧСС: ',
      key: 'localChss',
      type: 'number',
      pattern: '^[0-9]*',
      errorText: 'Поле не может быть отрицательным',
      styleClass: 'line-form col-6',
      postLabel: 'в сек.',
      additional: {
        block: 'local_efficiency_assistance'
      }
    },
    {
      label: 'PS: ',
      key: 'localPulse',
      type: 'number',
      pattern: '^[0-9]*',
      errorText: 'Поле не может быть отрицательным',
      styleClass: 'line-form col-6',
      postLabel: 'в сек.',
      additional: {
        block: 'local_efficiency_assistance'
      }
    },
    {
      label: 'АД: ',
      key: 'localAd',
      type: 'number',
      pattern: '^[0-9]*',
      errorText: 'Поле не может быть отрицательным',
      styleClass: 'line-form col-6',
      postLabel: 'мм Hg.',
      additional: {
        block: 'local_efficiency_assistance'
      }
    },
    {
      label: 'Рабочее АД: ',
      key: 'localWorkAd',
      type: 'number',
      pattern: '^[0-9]*',
      errorText: 'Поле не может быть отрицательным',
      styleClass: 'line-form col-6',
      postLabel: 'мм Hg',
      additional: {
        block: 'local_efficiency_assistance'
      }
    },
    {
      label: 't тела: ',
      key: 'localTemperature',
      type: 'number',
      pattern: '^[0-9]*',
      errorText: 'Поле не может быть отрицательным',
      styleClass: 'line-form col-6',
      postLabel: '°С',
      additional: {
        block: 'local_efficiency_assistance'
      }
    },
    {
      label: 'ЧД: ',
      key: 'localChd',
      type: 'number',
      pattern: '^[0-9]*',
      errorText: 'Поле не может быть отрицательным',
      styleClass: 'line-form col-6',
      postLabel: 'в сек.',
      additional: {
        block: 'local_efficiency_assistance'
      }
    },
    {
      label: 'Глюкометрия: ',
      key: 'localGlucometry',
      type: 'number',
      pattern: '^[0-9]*',
      errorText: 'Поле не может быть отрицательным',
      styleClass: 'line-form col-6',
      postLabel: 'ммоль',
      additional: {
        block: 'local_efficiency_assistance'
      }
    },
    {
      label: 'Sat O2: ',
      key: 'localPulseOximetry',
      type: 'number',
      pattern: '^[0-9]*',
      errorText: 'Поле не может быть отрицательным',
      styleClass: 'line-form col-6',
      postLabel: '%',
      additional: {
        block: 'local_efficiency_assistance'
      }
    },
    {
      label: 'Ритм',
      type: 'number',
      pattern: '^[0-9]*',
      errorText: 'Поле не может быть отрицательным',
      key: 'ekgRhytmAfter',
      styleClass: 'line-form col-12',
      additional: {
        block: 'ekg_after'
      }
    },
    {
      label: 'ЧСС',
      type: 'number',
      pattern: '^[0-9]*',
      errorText: 'Поле не может быть отрицательным',
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
      key: 'resultCauseFK',
      dict: 'getReferenceTypeListResultCauseUsingGET',
      styleClass: 'col-12',
      additional: {
        block: 'assistance_result'
      }
    },
  ];
  // blocks: { label: string, name: string, itemName?: string, mode?: string }[] = [
  //   {label: 'Смерть', name: 'deathTime', itemName: 'deathTime', mode: 'death'},
  //   {label: 'Транспортировка', name: 'transporting', itemName: 'transporting', mode: 'transport'},
  //   {label: 'Передача спец. бригаде', name: 'transfer_patient', itemName: 'transfer_patient', mode: 'transfer'},
  //   {label: 'Диагноз', name: 'diagnosis', itemName: 'diagnosis'},
  //   {label: 'Экг', name: 'ekg', itemName: 'ekg'},
  //   {label: 'Активное посещение', name: 'activeVisitFK', itemName: 'activeVisitFK'},
  // ];
  // blocks: { name: string, arrBlock: string[], mode: string}[] = [
  blocks = {
      noBlocks: {arrBlock: []},
      general: {arrBlock: [{ label: 'Диагноз', block:'diagnosis'}, {label:'Активное посещение', block:'activeVisitFK'}, {label: 'Экг', block:'ekg'}]},
      transport: {arrBlock: [{ label: 'Диагноз', block:'diagnosis'}, {label:'Активное посещение', block:'activeVisitFK'}, {label: 'Экг', block:'ekg'}, { label: 'Транспортировка', block:'transporting'}]},
      transfer: {arrBlock: [{ label: 'Диагноз', block:'diagnosis'}, {label:'Активное посещение', block:'activeVisitFK'}, {label: 'Экг', block:'ekg'}, {label: 'Передача спецбригаде', block:'transfer_patient'}]},
      deathTime: {arrBlock: [{ label: 'Диагноз', block:'diagnosis'}, {label:'Активное посещение', block:'activeVisitFK'}, {label: 'Экг', block:'ekg'}, {label: 'смерть', block:'deathTime'}]},
      undef: {arrBlock:[]}
  };


  constructor(private api: MedApi, private route: ActivatedRoute,
              private cas: CardItemService,
              private ns: NotificationsService,
              private modal: NgbModal,
              private modalInstance: NgbActiveModal,
              private sds: SimpleDescriptionService) {
  }

  ngOnInit() {
    this.form = this.sds.makeForm(this.descriptions);
    this.formType = this.sds.makeForm(this.descriptionsType);
    this.sbscs.push(
      this.cas.cardItemSub.subscribe(objective => {
        this.objective = objective;
        this.formType.reset(this.objective);
        this.objective.resultTypeFK ? this.setMode(this.objective.resultTypeFK.id) : true;
      }),
      this.form.valueChanges.subscribe(
        result => {
          this.cas.formResult = this.form.invalid;
          Object.assign(this.objective.cardResultBean, result);
        }
      ),
      this.formType.valueChanges.subscribe(
        ch => {
          Object.assign(this.objective, ch);
          this.cas.formTypeResult = this.formType.invalid;
          this.objective.resultTypeFK ? this.setMode(this.objective.resultTypeFK.id) : true;
        }
      )
  );
  this.form.reset(this.objective.cardResultBean);
  }

  ngOnDestroy() {
    this.sbscs.forEach(el => el.unsubscribe());
  }

  setMode(typeId) {
    console.log(typeId);
    switch (typeId) {
      case 0:
        this.mode = 'noBlocks';
      case 337736:
      case 337740:
        this.mode = 'general';
        break;
      case 337737:
      case 337738:
        this.mode = 'transport';
        break;
      case 337739:
        this.mode = 'transfer';
        break;
      case 337742:
      case 337741:
      case 337747:
        this.mode = 'deathTime';
        break;
      default:
        this.mode = 'undef';
    }
  }

  selectTherapy(e) {
    this.selectedTherapy = e.data;
  }


  getBlockDescriptions(block: string): ISimpleDescription[] {
    return this.descriptions.filter(el => {
      if (el.additional) {
        return el.additional.block === block;
      }
      return false;
    });
  }

  chooseMainDiagnosis(){
    const chooseDiagnosis = this.modal.open(ModalMkb10DiagnosisComponent, {size: 'lg'});
    chooseDiagnosis.result.then(
      res => {
        if (res) {
          console.log(res);
          this.form.controls['mkbFK'].setValue(res);
        }
      }
    )
  }
  chooseConcomitantDiagnosis(){
    const chooseConcomitantDiagnosis = this.modal.open(ModalMkb10DiagnosisComponent, {size: 'lg'});
    chooseConcomitantDiagnosis.result.then(
      res => {
        if (res) {
          console.log(res);
          this.form.controls['concomitantDiagnosisFK'].setValue(res);
        }
      }
    )
  }
}
