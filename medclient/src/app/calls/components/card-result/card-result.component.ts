import {Component, OnInit} from '@angular/core';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {FormGroup} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {CardItemService} from '../../services/card-item.service';
import {NotificationsService} from 'angular2-notifications';
import {Subscription} from 'rxjs';
import {ColDef} from 'ag-grid-community';
import {CardResultDto, MedApi} from '../../../../../swagger/med-api.service';
import {DatePipe} from '@angular/common';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalAddTherapyComponent} from '../modal-add-therapy/modal-add-therapy.component';

@Component({
  selector: 'app-card-result',
  templateUrl: './card-result.component.html',
  styleUrls: ['./card-result.component.scss']
})
export class CardResultComponent implements OnInit {
  datePipe = new DatePipe('ru');
  colDefs: ColDef[] = [
    {
      headerName: 'Дата',
      field: 'date',
      sortable: true,
      filter: true,
      valueFormatter: (p) => this.datePipe.transform(p.value, 'dd.MM.yyyy hh:mm'),
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
  listSource: any[] = [];
  selectedTherapy: any;
  sbscs: Subscription[] = [];
  cardResult: CardResultDto;
  cardId: any;
  mode: string;
  forms: {
    block: string,
    descriptions: ISimpleDescription[],
    form?: FormGroup
  }[] =
    [
      {
        block: 'type',
        descriptions: [
          {
            label: 'Тип: ',
            type: 'dict',
            key: 'type_id',
            shortDict: true,
            dict: 'readAllUsingGET_34',
            dictFilters: {type: 'RESULT'},
            dictFiltersOrder: ['type'],
            bindValue: 'id',
            bindLabel: 'name',
            styleClass: 'col-12'
          },
        ]
      },
      {
        block: 'death',
        descriptions: [
          {
            label: 'Время',
            key: 'time',
            type: 'date',
            styleClass: 'line-form col-12'
          }
        ]
      },
      {
        block: 'transporting',
        descriptions: [
          {
            label: 'Способ',
            type: 'dict',
            key: 'hosp_transporation_id',
            shortDict: true,
            bindLabel: 'name',
            bindValue: 'id',
            dict: 'readAllUsingGET_34',
            dictFilters: {type: 'TRANSPORTATION_METHOD'},
            dictFiltersOrder: ['type']
          },
          {
            label: 'Куда',
            type: 'dict',
            key: 'hosp_to_id',
            shortDict: true,
            bindLabel: 'name',
            bindValue: 'id',
            dict: 'readAllUsingGET_15',
          },
          {
            label: 'Дата/Время',
            key: 'transporting_date',
            type: 'date',
          },
        ]
      },
      {
        block: 'transfer_patient',
        descriptions: [
          {
            label: 'Номер бригады',
            type: 'text',
            key: 'brigade_number',
          },
          {
            label: 'Дата/Время',
            key: 'time',
            type: 'date',
          }
        ]
      },
      {
        block: 'diagnosis',
        descriptions: [
          {
            label: 'Осложнения',
            key: 'complication_id',
            type: 'dict',
            shortDict: true,
            dictFilters: {type: 'COMPLICATIONS'},
            dictFiltersOrder: ['type'],
            bindLabel: 'name',
            bindValue: 'id',
            dict: 'readAllUsingGET_34',
          }
        ]
      },
      {
        block: 'ekg',
        descriptions: [
          {
            label: 'Ритм',
            type: 'text',
            key: 'ekg_rhythm',
            styleClass: 'line-form col-6'
          },
          {
            label: 'ЧСС',
            type: 'number',
            key: 'ekg_ch_s_s',
            styleClass: 'line-form col-6',
            postLabel: 'в мин.'
          },
          {
            label: 'Комментарии',
            type: 'textarea',
            key: 'ekg_comments',
            rows: 4
          }
        ]
      },
      {
        block: 'active_visit',
        descriptions: [
          {
            label: 'Кем',
            key: 'active_visit_type_id',
            type: 'dict',
            shortDict: true,
            dictFilters: {type: 'ACTIVE_VISIT'},
            dictFiltersOrder: ['type'],
            bindLabel: 'name',
            bindValue: 'id',
            dict: 'readAllUsingGET_34',
            styleClass: 'line-form col-6',
          },
          {
            label: 'Через',
            type: 'number',
            key: 'active_visit_hours',
            styleClass: 'line-form col-6',
            postLabel: 'час'
          },
        ]
      },
      {
        block: 'comments',
        descriptions: [
          {
            label: 'Примечания',
            type: 'textarea',
            key: 'comments',
            rows: 4
          }
        ]
      },
      {
        block: 'transport_efficiency_assistance',
        descriptions: [
          {
            label: 'ЧСС: ',
            key: 'chss',
            type: 'text',
            styleClass: 'line-form col-6',
            postLabel: 'в сек.'
          },
          {
            label: 'PS: ',
            key: 'pulse',
            type: 'text',
            styleClass: 'line-form col-6',
            postLabel: 'в сек.'
          },
          {
            label: 'АД: ',
            key: 'ad',
            type: 'text',
            styleClass: 'line-form col-6',
            postLabel: 'мм Hg.'
          },
          {
            label: 'Рабочее АД: ',
            key: 'work_ad',
            type: 'text',
            styleClass: 'line-form col-6',
            postLabel: 'мм Hg'
          },
          {
            label: 't тела: ',
            key: 'temperature',
            type: 'text',
            styleClass: 'line-form col-6',
            postLabel: '°С'
          },
          {
            label: 'ЧД: ',
            key: 'chd',
            type: 'text',
            styleClass: 'line-form col-6',
            postLabel: 'в сек.'
          },
          {
            label: 'Глюкометрия: ',
            key: 'glucometry',
            type: 'text',
            styleClass: 'line-form col-6',
            postLabel: 'ммоль'
          },
          {
            label: 'Sat O2: ',
            key: 'pulse_oximetry',
            type: 'text',
            styleClass: 'line-form col-6',
            postLabel: '%'
          },
        ]
      },
      {
        block: 'local_efficiency_assistance',
        descriptions: [
          {
            label: 'ЧСС: ',
            key: 'chss',
            type: 'text',
            styleClass: 'line-form col-6',
            postLabel: 'в сек.'
          },
          {
            label: 'PS: ',
            key: 'pulse',
            type: 'text',
            styleClass: 'line-form col-6',
            postLabel: 'в сек.'
          },
          {
            label: 'АД: ',
            key: 'ad',
            type: 'text',
            styleClass: 'line-form col-6',
            postLabel: 'мм Hg.'
          },
          {
            label: 'Рабочее АД: ',
            key: 'work_ad',
            type: 'text',
            styleClass: 'line-form col-6',
            postLabel: 'мм Hg'
          },
          {
            label: 't тела: ',
            key: 'temperature',
            type: 'text',
            styleClass: 'line-form col-6',
            postLabel: '°С'
          },
          {
            label: 'ЧД: ',
            key: 'chd',
            type: 'text',
            styleClass: 'line-form col-6',
            postLabel: 'в сек.'
          },
          {
            label: 'Глюкометрия: ',
            key: 'glucometry',
            type: 'text',
            styleClass: 'line-form col-6',
            postLabel: 'ммоль'
          },
          {
            label: 'Sat O2: ',
            key: 'pulse_oximetry',
            type: 'text',
            styleClass: 'line-form col-6',
            postLabel: '%'
          },
        ]
      },
      {
        block: 'ekg_after',
        descriptions: [
          {
            label: 'Ритм',
            type: 'text',
            key: 'ekg_rhythm',
            styleClass: 'line-form col-6'
          },
          {
            label: 'ЧСС',
            type: 'number',
            key: 'ekg_ch_s_s',
            styleClass: 'line-form col-6',
            postLabel: 'в мин'
          },
          {
            label: 'Комментарии',
            type: 'textarea',
            key: 'ekg_comments',
            rows: 4
          }
        ]
      },
      {
        block: 'assistance_result',
        descriptions: [
          {
            label: 'Результат мероприятий: ',
            type: 'dict',
            key: 'assistance_result_id',
            shortDict: true,
            dict: 'readAllUsingGET_34',
            dictFilters: {type: 'COMPLICATIONS_HELP'},
            dictFiltersOrder: ['type'],
            bindValue: 'id',
            bindLabel: 'name',
            styleClass: 'col-12'
          },
        ]
      },

    ];
  blocks: { label: string, name: string, itemName?: string, mode?: string }[] = [
    // {label: '', name: 'type', itemName: 'type'},
    {label: 'Смерть', name: 'death', itemName: 'death', mode: 'death'},
    {label: 'Транспортировка', name: 'transporting', itemName: 'transporting', mode: 'transport'},
    {label: 'Передача спец. бригаде', name: 'transfer_patient', itemName: 'transfer_patient', mode: 'transfer'},
    {label: 'Диагноз', name: 'diagnosis', itemName: 'diagnosis'},
    {label: 'Экг', name: 'ekg', itemName: 'ekg'},
    {label: 'Активное посещение', name: 'active_visit', itemName: 'active_visit'},
    {label: 'Примечание', name: 'comments'},
    // {label: 'Мероприятия на месте', name: 'local_therapies', itemName: 'local_therapies'},
    // {label: 'Мероприятия в машине', name: 'transport_therapies', itemName: 'transport_therapies'},
    // {label: 'Эффективность', name: 'local_efficiency_assistance', itemName: 'local_efficiency_assistance'},
    // {label: 'Эффективность', name: 'transport_efficiency_assistance', itemName: 'transport_efficiency_assistance'},
    // {label: 'Экг после меропрятий', name: 'ekg_after', itemName: 'ekg_after'},
    // {label: 'Результат меропрятий', name: 'assistance_result', itemName: 'assistance_result'},
    ];


  constructor(private api: MedApi, private route: ActivatedRoute,
              private cas: CardItemService,
              private ns: NotificationsService,
              private modal: NgbModal,
              private modalInstance: NgbActiveModal,
              private sds: SimpleDescriptionService) {
  }

  ngOnInit() {
    // this.api.readAllUsingGET_40().subscribe(
    //   therapies => {
    //     console.log('->', therapies);
    //     this.listSource = therapies;
    //   }
    // );
    this.updateTherapies();
    this.forms.forEach(
      f => {
        f.form = this.sds.makeForm(f.descriptions);
      }
    );
    this.sbscs.push(
      this.route.data.subscribe(data => {
        this.cardResult = data.cardResult;
      }),
      this.route.parent.paramMap.subscribe(data => {
        this.cardId = data.get('cardId');
      }),
      this.forms[this.forms.findIndex( f => f.block === 'type')].form.valueChanges.subscribe(
        val => this.setMode(val.type_id)
      )
    );
      console.log(this.cardResult);
  }

  updateTherapies() {
    this.api.readAllUsingGET_40().subscribe(
      therapies => {
        console.log('->', therapies);
        this.listSource = therapies;
      }
    );
  }

  setMode(typeId) {
    console.log(typeId);
    switch (typeId) {
      case 337736: this.mode = 'helpAndLeave'; break;
      case 337737:
      case 337738: this.mode = 'transport'; break;
      case 337739: this.mode = 'transfer'; break;
      case 337740: this.mode = 'helpAndLeave'; break;
      case 337741:
      case 337742: this.mode = 'death'; break;
      default: this.mode = 'undef';
    }
  }

  selectTherapy(e) {
    this.selectedTherapy = e.data;
  }

  addTherapy(local) {
    const addTh = this.modal.open(ModalAddTherapyComponent, {size: 'lg'});
    addTh.result.then(
      success => {
        this.modalInstance.close();
      },
      rej => {
        this.updateTherapies();
      }
    );
    addTh.componentInstance.local = local;
  }

  getBlockDescriptions(block: string): ISimpleDescription[] {
    let desc: ISimpleDescription[];
    this.forms.forEach(
      f => {
        if (f.block === block) {
          desc = f.descriptions;
        }
      }
    );
    return desc;
  }

  getBlockForm(block: string): FormGroup {
    let form: FormGroup;
    this.forms.forEach(
      f => {
        if (f.block == block) {
          form = f.form;
        }
      }
    );
    return form;
  }

  getBlockFormValues(block: string) {
    let values;
    this.forms.forEach(
      f => {
        if (f.block === block) {
          values = f.form.getRawValue();
        }
      }
    );
    return values;
  }

  save() {
    let result = {};
    Object.keys(this.cardResult).forEach(
      key => {
        Object.assign(result, this.getBlockFormValues(key));
      }
    );
    this.cardResult.header.is_created = true;
    this.cas.saveResult(this.cardId, result).subscribe(
      res => {
        this.ns.success('Успешно', 'Изменения успешно сохранены');
        this.cardResult = res;
      },
      error => {
        this.ns.error('Ошибка', 'Не удалось сохранить изменения');
      }
    );
    console.log(result);
  }


}
