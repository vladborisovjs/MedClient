import {Component, OnDestroy, OnInit} from '@angular/core';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {NotificationsService} from 'angular2-notifications';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {FormGroup} from '@angular/forms';
import {CallContainer, CardBean} from '../../../../../swagger/med-api.service';
import {CardItemService} from '../../services/card-item.service';
import {CallItemService} from '../../services/call-item.service';

@Component({
  selector: 'app-card-side-two',
  templateUrl: './card-side-two.component.html',
  styleUrls: ['./card-side-two.component.scss']
})
export class CardSideTwoComponent implements OnInit, OnDestroy {
  sbscs: Subscription[] = [];
  cardId: any;
  liverLarge: boolean = false;
  patientYear: number;
  objective: CardBean;
  patient: CallContainer;
  form: FormGroup;
  descriptions: ISimpleDescription[] = [
    {
      label: 'Тип',
      key: 'generalStateFK',
      type: 'dict',
      dict: 'getReferenceTypeListGeneralStateUsingGET',
      styleClass: 'col-4',
      additional: {
        block: 'general_state'
      }
    },
    {
      label: 'Сознание',
      key: 'consciousFK',
      type: 'dict',
      dict: 'getReferenceTypeListConsciousUsingGET',
      styleClass: 'col-4',
      additional: {
        block: 'general_state'
      }
    },
    {
      label: 'Поведение',
      key: 'behaviourFK',
      type: 'dict',
      dict: 'getReferenceTypeListBehaviourUsingGET',
      styleClass: 'col-4',
      additional: {
        block: 'general_state'
      }
    },
    {
      label: 'Речевая реакция: ',
      key: 'verbalResponse',
      type: 'select',
      styleClass: 'line-form  col-12',
      selectList: [
        {
          name: this.patientYear < 3 ? 'Ребенок улыбается, ориентируется на звук, следит за объектами, интерактивен' : 'Правильная речь',
          id: 5
        },
        {
          name: this.patientYear < 3 ?  'Ребенка при плаче можно успокоить, интерактивность неполноценная' : 'Спутанная речь',
          id: 4
        },
        {
          name: this.patientYear < 3 ?  'При плаче успокаивается, но ненадолго, стонет' : 'Членораздельная речь (отдельный набор слов)',
          id: 3
        },
        {
          name: this.patientYear < 3 ?  'Не успокаивается при плаче, беспокоен' : 'Нечленораздельная речь (непонятные звуки)',
          id: 2
        },
        {
          name: this.patientYear < 3 ?  'Плач и интерактивность отсутствуют' : 'Отсутствие речевой продукции',
          id: 1
        },
      ],
      additional: {
        block: 'glasgow'
      }
    },
    {
      label: 'Двигательная реакция: ',
      key: 'motorResponse',
      type: 'select',
      styleClass: 'line-form  col-12',
      selectList: [
        {name: 'По команде', id: 6},
        {name: 'Локализация боли', id: 5},
        {name: 'Удаление конечности от источника раздражения', id: 4},
        {name: 'Аномальное сгибание (декортикационная ригидность)', id: 3},
        {name: 'Аномальное разгибание (децеребрационная ригидность)', id: 2},
        {name: 'Отсутствие реакции на боль', id: 1},
      ],
      additional: {
        block: 'glasgow'
      }
    },
    {
      label: 'Открывание глаз: ',
      key: 'eyeOpening',
      type: 'select',
      styleClass: 'line-form  col-12',
      selectList: [
        {name: 'Произвольное', id: 4},
        {name: 'На окрик', id: 3},
        {name: 'На боль', id: 2},
        {name: 'Отсутствие реакции', id: 1},
      ],
      additional: {
        block: 'glasgow'
      }
    },
    {
      label: 'Наличие',
      key: 'titles',
      type: 'checkbox',
      additional: {
        block: 'edema'
      }
    },
    {
      label: 'Локализ',
      key: 'titlesText',
      type: 'text',
      additional: {
        block: 'edema'
      }
    },
    {
      label: 'обычные',
      key: 'skinIsNormal',
      type: 'checkbox',
      styleClass: 'col-6',
      additional: {
        block: 'skin'
      }
    },
    {
      label: 'акроцианоз',
      key: 'skinAcrosianosis',
      type: 'checkbox',
      styleClass: 'col-6',
      additional: {
        block: 'skin'
      }
    },
    {
      label: 'цианотичные',
      key: 'skinIntegCyanotic',
      type: 'checkbox',
      styleClass: 'col-6',
      additional: {
        block: 'skin'
      }
    },
    {
      label: 'гиперемированные',
      key: 'skinHyperemetic',
      type: 'checkbox',
      styleClass: 'col-6',
      additional: {
        block: 'skin'
      }
    },
    {
      label: 'сухие',
      key: 'skinIsDry',
      type: 'checkbox',
      styleClass: 'col-6',
      additional: {
        block: 'skin'
      }
    },
    {
      label: 'высыпания',
      key: 'skinRashes',
      type: 'checkbox',
      styleClass: 'col-6',
      additional: {
        block: 'skin'
      }
    },
    {
      label: 'Цвет кожи',
      key: 'skinColorFK',
      type: 'dict',
      dict: 'getReferenceTypeListSkinColorUsingGET',
      additional: {
        block: 'skin'
      }
    },
    {
      label: 'Пульс',
      key: 'heartRateFK',
      type: 'dict',
      dict: 'getReferenceTypeListHeartRateUsingGET',
      styleClass: 'col-4',
      additional: {
        block: 'heart'
      }
    },
    {
      label: 'Тоны сердца',
      key: 'heartToneFK',
      type: 'dict',
      dict: 'getReferenceTypeListHeartToneUsingGET',
      styleClass: 'col-4',
      additional: {
        block: 'heart'
      }
    },
    {
      label: 'Шумы',
      key: 'heartNoiseFK',
      type: 'dict',
      dict: 'getReferenceTypeListHeartNoiseUsingGET',
      styleClass: 'col-4',
      additional: {
        block: 'heart'
      }
    },
    {
      label: 'ЧСС: ',
      key: 'heartChss',
      type: 'number',
      pattern: '^[0-9]*',
      errorText: 'Поле не может быть отрицательным',
      styleClass: 'line-form col-12',
      postLabel: 'в сек.',
      additional: {
        block: 'other'
      }
    },
    {
      label: 'PS: ',
      key: 'heartPs',
      type: 'number',
      pattern: '^[0-9]*',
      errorText: 'Поле не может быть отрицательным',
      styleClass: 'line-form col-12',
      postLabel: 'в сек.',
      additional: {
        block: 'other'
      }
    },
    {
      label: 'АД: ',
      key: 'heartAd',
      type: 'number',
      pattern: '^[0-9]*',
      errorText: 'Поле не может быть отрицательным',
      styleClass: 'line-form col-12',
      postLabel: 'мм Hg',
      additional: {
        block: 'other'
      }
    },
    {
      label: 'АДN: ',
      key: 'heartAdn',
      type: 'number',
      pattern: '^[0-9]*',
      errorText: 'Поле не может быть отрицательным',
      styleClass: 'line-form col-12',
      postLabel: 'мм Hg',
      additional: {
        block: 'other'
      }
    },
    {
      label: 'АД max: ',
      key: 'heartAdMax',
      type: 'number',
      pattern: '^[0-9]*',
      errorText: 'Поле не может быть отрицательным',
      styleClass: 'line-form col-12',
      postLabel: 'мм Hg',
      additional: {
        block: 'other'
      }
    },
    {
      label: 't тела: ',
      key: 'heartBodyTemp',
      type: 'number',
      pattern: '^[0-9]*',
      errorText: 'Поле не может быть отрицательным',
      styleClass: 'line-form col-12',
      postLabel: '°C',
      additional: {
        block: 'other'
      }
    },
    {
      label: 'ЧД: ',
      key: 'heartChd',
      type: 'number',
      pattern: '^[0-9]*',
      errorText: 'Поле не может быть отрицательным',
      styleClass: 'line-form col-12',
      postLabel: 'в сек.',
      additional: {
        block: 'other'
      }
    },
    {
      label: 'Глюкометрия: ',
      key: 'glucometry',
      type: 'number',
      pattern: '^[0-9]*',
      errorText: 'Поле не может быть отрицательным',
      styleClass: 'line-form col-12',
      postLabel: 'ммоль',
      additional: {
        block: 'other'
      }
    },
    {
      label: 'Sat O2: ',
      key: 'pulseOximetry',
      type: 'number',
      pattern: '^[0-9]*',
      errorText: 'Поле не может быть отрицательным',
      styleClass: 'line-form col-12',
      postLabel: '%',
      additional: {
        block: 'other'
      }
    },
    {
      label: 'Соотношение',
      key: 'penaltiesDsFK',
      type: 'dict',
      dict: 'getReferenceTypeListPenaltiesDSUsingGET',
      styleClass: 'col-6',
      additional: {
        block: 'pupils'
      }
    },
    {
      label: 'Зрачки',
      key: 'penaltiesFK',
      type: 'dict',
      dict: 'getReferenceTypeListPenaltiesUsingGET',
      styleClass: 'col-6',
      additional: {
        block: 'pupils'
      }
    },
    {
      label: 'Реакция на свет',
      key: 'penaltiesLight',
      type: 'tricheckbox',
      styleClass: 'col-4',
      additional: {
        block: 'pupils'
      }
    },
    {
      label: 'Анизокрия',
      key: 'penaltiesAnisocoria',
      type: 'tricheckbox',
      styleClass: 'col-4',
      additional: {
        block: 'pupils'
      }
    },
    {
      label: 'Нистагм',
      key: 'penaltiesNystagmus',
      type: 'tricheckbox',
      styleClass: 'col-4',
      additional: {
        block: 'pupils'
      }
    },
    {
      label: 'Увеличены',
      key: 'lymphNodesNormalLarge',
      type: 'tricheckbox',
      additional: {
        block: 'lymph'
      }
    },
    {
      label: 'Локализ',
      key: 'lymphNodesText',
      type: 'text',
      additional: {
        block: 'lymph'
      }
    },
    {
      label: 'Болезненно',
      key: 'lymphNodesPainful',
      type: 'tricheckbox',
      additional: {
        block: 'lymph'
      }
    },
    {
      label: 'Увеличины',
      key: 'almondsNormalLarge',
      type: 'tricheckbox',
      styleClass: 'col-6',
      additional: {
        block: 'tonsils'
      }
    },
    {
      label: 'Налеты',
      key: 'almondsPlaque',
      type: 'checkbox',
      styleClass: 'col-6',
      additional: {
        block: 'tonsils'
      }
    },
    {
      label: 'Слизистая зева',
      key: 'multipleZevaCleanHyper',
      type: 'select',
      selectList: [
        {name: 'н/у', id: null},
        {name: 'чистая', id: true},
        {name: 'гиперемированная', id: false},
      ],
      additional: {
        block: 'throat'
      }
    },
    {
      label: 'Перкуторно над легким звук',
      key: 'percLungsSoundFK',
      type: 'dict',
      dict: 'getReferenceTypeListPercLungsSoundUsingGET',
      additional: {
        block: 'perc'
      }
    },
    {
      label: 'Локализ',
      key: 'percLungsSoundText',
      type: 'text',
      additional: {
        block: 'perc'
      }
    },
    {
      label: 'Обложен',
      key: 'tongueCleanFurred',
      type: 'checkbox',
      styleClass: 'col-6',
      additional: {
        block: 'tongue'
      }
    },
    {
      label: 'Влажность',
      key: 'tongueWeatDry',
      type: 'checkbox',
      styleClass: 'col-6',
      additional: {
        block: 'tongue'
      }
    },
    {
      label: 'обычной формы',
      key: 'stomachNormal',
      type: 'checkbox',
      styleClass: 'col-6',
      additional: {
        block: 'stomach'
      }
    },
    {
      label: 'вздут',
      key: 'stomachInflated',
      type: 'checkbox',
      styleClass: 'col-6',
      additional: {
        block: 'stomach'
      }
    },
    {
      label: 'признаки асцита',
      key: 'stomachAscites',
      type: 'checkbox',
      styleClass: 'col-6',
      additional: {
        block: 'stomach'
      }
    },
    {
      label: 'напряжен',
      key: 'stomachIsHard',
      type: 'checkbox',
      styleClass: 'col-6',
      additional: {
        block: 'stomach'
      }
    },
    {
      label: 'доскообразный',
      key: 'stomachDisklike',
      type: 'checkbox',
      styleClass: 'col-6',
      additional: {
        block: 'stomach'
      }
    },
    {
      label: 'болезненный',
      key: 'stomachIsPainful',
      type: 'checkbox',
      styleClass: 'col-6',
      additional: {
        block: 'stomach'
      }
    },
    {
      label: 'Перетонит',
      key: 'stomachPeritonit',
      type: 'tricheckbox',
      styleClass: 'col-6',
      additional: {
        block: 'stomach'
      }
    },
    {
      label: 'Уч-ет в акте дыхания',
      key: 'stomachBreathingInvolved',
      type: 'tricheckbox',
      styleClass: 'col-6',
      additional: {
        block: 'stomach'
      }
    },
    {
      label: 'Примечания',
      key: 'stomachText',
      type: 'text',
      additional: {
        block: 'stomach'
      }
    },
    {
      label: 'везикулярное',
      key: 'breathVesicular',
      type: 'checkbox',
      styleClass: 'col-6',
      additional: {
        block: 'breath'
      }
    },
    {
      label: 'равномерно провод. во все отд.',
      key: 'breathEvenly',
      type: 'checkbox',
      styleClass: 'col-6',
      additional: {
        block: 'breath'
      }
    },
    {
      label: 'пуэрильное',
      key: 'breathPure',
      type: 'checkbox',
      styleClass: 'col-6',
      additional: {
        block: 'breath'
      }
    },
    {
      label: 'ослабленное',
      key: 'breathIsWeak',
      type: 'checkbox',
      styleClass: 'col-6',
      additional: {
        block: 'breath'
      }
    },
    {
      label: 'бронхиальное',
      key: 'breathBronchial',
      type: 'checkbox',
      styleClass: 'col-6',
      additional: {
        block: 'breath'
      }
    },
    {
      label: 'отсутсвует',
      key: 'breathAbsent',
      type: 'checkbox',
      styleClass: 'col-6',
      additional: {
        block: 'breath'
      }
    },
    {
      label: 'Одышка',
      key: 'dyspneaFK',
      type: 'dict',
      dict: 'getReferenceTypeListDyspneaUsingGET',
      additional: {
        block: 'breath'
      }
    },
    {
      label: 'Локализ измен. дых.',
      key: 'breathText',
      type: 'textarea',
      rows: 4,
      additional: {
        block: 'breath'
      }
    },
    {
      label: 'Тип',
      key: 'lungsWheezingFK',
      type: 'dict',
      dict: 'getReferenceTypeListLungsWheezingUsingGET',
      additional: {
        block: 'wheezing'
      }
    },
    {
      label: 'Локализ',
      key: 'lungsWheezingText',
      type: 'text',
      additional: {
        block: 'wheezing'
      }
    },
    {
      label: 'Увеличена',
      key: 'liverNormalLarge',
      type: 'tricheckbox',
      styleClass: 'col-12',
      additional: {
        block: 'liver'
      }
    },
    {
      label: 'с-м Ортнера',
      key: 'liverOrtner',
      type: 'checkbox',
      styleClass: 'col-12',
      additional: {
        block: 'liver'
      }
    },
    {
      label: 'Размер: ',
      key: 'liverSizeText',
      type: 'number',
      pattern: '^[0-9]*',
      errorText: 'Поле не может быть отрицательным',
      postLabel: 'см',
      styleClass: 'col-6',
      additional: {
        block: 'liverLarge'
      }
    },
    {
      label: 'нет',
      key: 'dyspepticsNo',
      type: 'checkbox',
      styleClass: 'col-6',
      additional: {
        block: 'dyspeptic'
      }
    },
    {
      label: 'тошнота',
      key: 'dyspepticNausea',
      type: 'checkbox',
      styleClass: 'col-6',
      additional: {
        block: 'dyspeptic'
      }
    },
    {
      label: 'рвота',
      key: 'dyspepticRetch',
      type: 'checkbox',
      styleClass: 'col-6',
      additional: {
        block: 'dyspeptic'
      }
    },
    {
      label: 'диарея',
      key: 'dyspepticDiarrhea',
      type: 'checkbox',
      styleClass: 'col-6',
      additional: {
        block: 'dyspeptic'
      }
    },
    {
      label: 'N',
      key: 'diuresisNo',
      type: 'checkbox',
      styleClass: 'col-6',
      additional: {
        block: 'diuresis'
      }
    },
    {
      label: 'дизурия',
      key: 'diuresisDisuria',
      type: 'checkbox',
      styleClass: 'col-6',
      additional: {
        block: 'diuresis'
      }
    },
    {
      label: 'слева',
      key: 'lionTappingLeft',
      type: 'checkbox',
      styleClass: 'col-6',
      additional: {
        block: 'diuresis'
      }
    },
    {
      label: 'олигурия',
      key: 'diuresisOliguria',
      type: 'checkbox',
      styleClass: 'col-6',
      additional: {
        block: 'diuresis'
      }
    },
    {
      label: 'гематургия',
      key: 'diuresisHematuria',
      type: 'checkbox',
      styleClass: 'col-6',
      additional: {
        block: 'diuresis'
      }
    },
    {
      label: 'справа',
      key: 'lionTappingRight',
      type: 'checkbox',
      styleClass: 'col-6',
      additional: {
        block: 'diuresis'
      }
    },
    {
      label: 'эмоциональная лабильность',
      key: 'alcoEmotionLability',
      type: 'checkbox',
      additional: {
        block: 'alcohol'
      }
    },
    {
      label: 'речь и поведение пьяного человека',
      key: 'alcoSpeechBehavior',
      type: 'checkbox',
      additional: {
        block: 'alcohol'
      }
    },
    {
      label: 'неадекватная оценка происходящей ситуации',
      key: 'alcoInadequate',
      type: 'checkbox',
      additional: {
        block: 'alcohol'
      }
    },
    {
      label: 'запах алкоголя в выдыхаемом воздухе',
      key: 'alcoBreath',
      type: 'checkbox',
      additional: {
        block: 'alcohol'
      }
    },
    {
      label: 'шаткая походка',
      key: 'alcoShakyWalk',
      type: 'checkbox',
      additional: {
        block: 'alcohol'
      }
    },
    {
      label: 'неустойчивость в позе Ромберга',
      key: 'alcoRombergPose',
      type: 'checkbox',
      additional: {
        block: 'alcohol'
      }
    },
    {
      label: 'Оформлен',
      key: 'excreta',
      type: 'tricheckbox',
      additional: {
        block: 'excreta'
      }
    },
    {
      label: 'Частота',
      key: 'excretaText',
      type: 'number',
      pattern: '^[0-9]*',
      errorText: 'Поле не может быть отрицательным',
      postLabel: 'раз в сутки',
      additional: {
        block: 'excreta'
      }
    },
    {
      label: 'Мочеиспускание',
      key: 'urineText',
      type: 'textarea',
      rows: 4,
      additional: {
        block: 'excreta'
      }
    },
    {
      label: 'Соотношение',
      key: 'reflexesDsFK',
      type: 'dict',
      dict: 'getReferenceTypeListReflexesDSUsingGET',
      styleClass: 'col-6',
      additional: {
        block: 'reflexes'
      }
    },
    {
      label: 'Рефлексы',
      key: 'tendonReflexesFK',
      type: 'dict',
      dict: 'getReferenceTypeListTendonReflexesUsingGET',
      styleClass: 'col-6',
      additional: {
        block: 'reflexes'
      }
    },
    {
      label: 'Менингеальные',
      key: 'meningealReflexes',
      type: 'checkbox',
      styleClass: 'col-6',
      additional: {
        block: 'reflexes'
      }
    },
    {
      label: 'Патологические',
      key: 'pathologicalReflexes',
      type: 'checkbox',
      styleClass: 'col-6',
      additional: {
        block: 'reflexes'
      }
    },
    {
      key: 'additionObjectives',
      type: 'textarea',
      rows: 4,
      additional: {
        block: 'addition'
      }
    }
  ];

  constructor(private ns: NotificationsService,
              private sds: SimpleDescriptionService,
              private route: ActivatedRoute,
              private cs: CallItemService,
              private cas: CardItemService) {
  }

  ngOnInit() {
    this.form = this.sds.makeForm(this.descriptions);
    this.sbscs.push(
      this.cas.cardItemSub.subscribe(objective => {
        this.objective = objective;
        console.log(this.objective);
        this.patientYear = this.objective.patientFK ? this.objective.patientFK.ageYears : undefined;
        console.log(this.patientYear);
      }),
      this.form.valueChanges.subscribe( ch => {
        Object.assign(this.objective.cardObjectiveBean, ch);
        this.cas.formObjectives = this.form.invalid;
        this.liverLarge = ch.liverNormalLarge; // если печень увеличена, то появляется поле ввода
      }),
    );
    this.form.reset(this.objective.cardObjectiveBean);
  }

  ngOnDestroy() {
    this.sbscs.forEach(el => el.unsubscribe());
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
