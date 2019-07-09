import {Component, OnDestroy, OnInit} from '@angular/core';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {NotificationsService} from 'angular2-notifications';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {FormGroup} from '@angular/forms';
import {CardObjectivePartDto, CardPatientPartDto} from '../../../../../swagger/med-api.service';
import {CardItemService} from '../../services/card-item.service';

@Component({
  selector: 'app-card-side-two',
  templateUrl: './card-side-two.component.html',
  styleUrls: ['./card-side-two.component.scss']
})
export class CardSideTwoComponent implements OnInit, OnDestroy {
  sbscs: Subscription[] = [];
  cardId: any;
  objective: CardObjectivePartDto;
  patientYear: number;
  forms: {
    block: string,
    descriptions: ISimpleDescription[],
    form?: FormGroup
  }[] =
    [
    {
      block: 'general_state',
      descriptions: [
        {
          label: 'Тип',
          key: 'general_state_id',
          type: 'dict',
          shortDict: true,
          dictFilters: {type: 'GENERAL_STATE'},
          dictFiltersOrder: ['type'],
          bindLabel: 'name',
          bindValue: 'id',
          dict: 'readAllUsingGET_34',
          styleClass: 'col-4',
        },
        {
          label: 'Сознание',
          key: 'conscious_id',
          type: 'dict',
          shortDict: true,
          dictFilters: {type: 'CONSCIOUS'},
          dictFiltersOrder: ['type'],
          bindLabel: 'name',
          bindValue: 'id',
          dict: 'readAllUsingGET_34',
          styleClass: 'col-4',
        },
        {
          label: 'Поведение',
          key: 'behaviour_id',
          type: 'dict',
          shortDict: true,
          dictFilters: {type: 'BEHAVIOUR'},
          dictFiltersOrder: ['type'],
          bindLabel: 'name',
          bindValue: 'id',
          dict: 'readAllUsingGET_34',
          styleClass: 'col-4',
        },
      ]
    },
    {
      block: 'glasgow',
      descriptions: [
        {
          label: 'Речевая реакция: ',
          key: 'verbal',
          type: 'select',
          styleClass: 'line-form  col-12',
          selectList: [
            {name: 'Правильная речь', id: 5},
            {name: 'Спутанная речь', id: 4},
            {name: 'Членораздельная речь (отдельный набор слов)', id: 3},
            {name: 'Нечленораздельная речь (непонятные звуки)', id: 2},
            {name: 'Отсутствие речевой продукции', id: 1},
          ],
        },
        {
          label: 'Двигательная реакция: ',
          key: 'motor',
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
        },
        {
          label: 'Открывание глаз: ',
          key: 'eye',
          type: 'select',
          styleClass: 'line-form  col-12',
          selectList: [
            {name: 'Произвольное', id: 4},
            {name: 'На окрик', id: 3},
            {name: 'На боль', id: 2},
            {name: 'Отсутствие реакции', id: 1},
          ],
        },
      ]
    },
    {
      block: 'glasgowChild',
      descriptions: [
        {
          label: 'Речевая реакция: ',
          key: 'verbal',
          type: 'select',
          styleClass: 'line-form  col-12',
          selectList: [
            {name: 'Ребенок улыбается, ориентируется на звук, следит за объектами, интерактивен', id: 5},
            {name: 'Ребенка при плаче можно успокоить, интерактивность неполноценная', id: 4},
            {name: 'При плаче успокаивается, но ненадолго, стонет', id: 3},
            {name: 'Не успокаивается при плаче, беспокоен', id: 2},
            {name: 'Плач и интерактивность отсутствуют', id: 1},
          ],
        },
        {
          label: 'Двигательная реакция: ',
          key: 'motor',
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
        },
        {
          label: 'Открывание глаз: ',
          key: 'eye',
          type: 'select',
          styleClass: 'line-form  col-12',
          selectList: [
            {name: 'Произвольное', id: 4},
            {name: 'На окрик', id: 3},
            {name: 'На боль', id: 2},
            {name: 'Отсутствие реакции', id: 1},
          ],
        },
      ]
    },
    {
      block: 'edema',
      descriptions: [
        {
          label: 'Наличие',
          key: 'titles',
          type: 'checkbox',
        },
        {
          label: 'Локализ',
          key: 'titles_text',
          type: 'text',
        },
      ]
    },
    {
      block: 'skin',
      descriptions: [
        {
          label: 'обычные',
          key: 'skin_integ_normal',
          type: 'checkbox',
          styleClass: 'col-6',
        },
        {
          label: 'бледные',
          key: 'skin_integ_pale',
          type: 'checkbox',
          styleClass: 'col-6',
        },
        {
          label: 'землистые',
          key: 'skin_integ_earthy',
          type: 'checkbox',
          styleClass: 'col-6',
        },
        {
          label: 'желтушные',
          key: 'skin_integ_icteric',
          type: 'checkbox',
          styleClass: 'col-6',
        },
        {
          label: 'акроцианоз',
          key: 'skin_integ_acrosian',
          type: 'checkbox',
          styleClass: 'col-6',
        },
        {
          label: 'цианотичные',
          key: 'skin_integ_cyanotic',
          type: 'checkbox',
          styleClass: 'col-6',
        },
        {
          label: 'гиперемированные',
          key: 'skin_integ_hyperemetic',
          type: 'checkbox',
          styleClass: 'col-6',
        },
        {
          label: 'сухие',
          key: 'skin_integ_dry',
          type: 'checkbox',
          styleClass: 'col-6',
        },
        {
          label: 'профузный пот',
          key: 'skin_integ_profuse',
          type: 'checkbox',
          styleClass: 'col-6',
        },
        {
          label: 'высыпания',
          key: 'skin_integ_rashes',
          type: 'checkbox',
          styleClass: 'col-6',
        },
        {
          label: 'мраморность',
          key: 'skin_integ_marbleness',
          type: 'checkbox',
          styleClass: 'col-6',
        },
      ]
    },
    {
      block: 'heart',
      descriptions: [
        {
          label: 'Пульс',
          key: 'heart_rate_id',
          type: 'dict',
          shortDict: true,
          dictFilters: {type: 'HEART_RATE'},
          dictFiltersOrder: ['type'],
          bindLabel: 'name',
          bindValue: 'id',
          dict: 'readAllUsingGET_34',
          styleClass: 'col-4',
        },
        {
          label: 'Тоны сердца',
          key: 'heart_tone_id',
          type: 'dict',
          shortDict: true,
          dictFilters: {type: 'HEART_TONE'},
          dictFiltersOrder: ['type'],
          bindLabel: 'name',
          bindValue: 'id',
          dict: 'readAllUsingGET_34',
          styleClass: 'col-4',
        },
        {
          label: 'Шумы',
          key: 'heart_noise_id',
          type: 'dict',
          shortDict: true,
          dictFilters: {type: 'HEART_NOISE'},
          dictFiltersOrder: ['type'],
          bindLabel: 'name',
          bindValue: 'id',
          dict: 'readAllUsingGET_34',
          styleClass: 'col-4',
        },
      ]
    },
    {
      block: 'other',
      descriptions: [
        {
          label: 'ЧСС: ',
          key: 'chss',
          type: 'text',
          styleClass: 'line-form col-11',
          postLabel: 'в сек.',
        },
        {
          label: 'PS: ',
          key: 'ps',
          type: 'text',
          styleClass: 'line-form col-11',
          postLabel: 'в сек.',
        },
        {
          label: 'АД: ',
          key: 'ad',
          type: 'text',
          styleClass: 'line-form col-11',
          postLabel: 'мм Hg',
        },
        {
          label: 'АДN: ',
          key: 'adn',
          type: 'text',
          styleClass: 'line-form col-11',
          postLabel: 'мм Hg',
        },
        {
          label: 'АД max: ',
          key: 'admax',
          type: 'text',
          styleClass: 'line-form col-11',
          postLabel: 'мм Hg',
        },
        {
          label: 't тела: ',
          key: 'bodytemp',
          type: 'text',
          styleClass: 'line-form col-11',
          postLabel: '°C',
        },
        {
          label: 'ЧД: ',
          key: 'chd',
          type: 'text',
          styleClass: 'line-form col-11',
          postLabel: 'в сек.',
        },
        {
          label: 'Глюкометрия: ',
          key: 'glucometry',
          type: 'text',
          styleClass: 'line-form col-11',
          postLabel: 'ммоль',
        },
        {
          label: 'Sat O2: ',
          key: 'pulse_oximetry',
          type: 'text',
          styleClass: 'line-form col-11',
          postLabel: '%',
        },
      ]
    },
    {
      block: 'pupils',
      descriptions: [
        {
          label: 'Соотношение',
          key: 'penalties_d_s_id',
          type: 'dict',
          shortDict: true,
          dictFilters: {type: 'PENALTIES_D_S'},
          dictFiltersOrder: ['type'],
          bindLabel: 'name',
          bindValue: 'id',
          dict: 'readAllUsingGET_34',
          styleClass: 'col-6',
        },
        {
          label: 'Зрачки',
          key: 'penalties_id',
          type: 'dict',
          shortDict: true,
          dictFilters: {type: 'PENALTIES'},
          dictFiltersOrder: ['type'],
          bindLabel: 'name',
          bindValue: 'id',
          dict: 'readAllUsingGET_34',
          styleClass: 'col-6',
        },
        {
          label: 'Реакция на свет',
          key: 'penalties_light',
          type: 'select',
          selectList: [
            {name: 'н/у', id: 0},
            {name: 'да', id: 1},
            {name: 'нет', id: 2},
          ],
        },
        {
          label: 'Анизокрия',
          key: 'penalties_anisocoria',
          type: 'select',
          selectList: [
            {name: 'н/у', id: 0},
            {name: 'да', id: 1},
            {name: 'нет', id: 2},
          ],
        },
        {
          label: 'Нистагм',
          key: 'penalties_nystagmus',
          type: 'select',
          selectList: [
            {name: 'н/у', id: 0},
            {name: 'да', id: 1},
            {name: 'нет', id: 2},
          ],
        },
      ]
    },
    {
      block: 'lymph',
      descriptions: [
        {
          label: 'Размер',
          key: 'lymph_nodes_normal_large',
          type: 'select',
          selectList: [
            {name: 'н/у', id: 0},
            {name: 'норм.', id: 1},
            {name: 'увелич.', id: 2},
          ],
        },
        {
          label: 'Локализ',
          key: 'lymph_nodes_text',
          type: 'text',
        },
        {
          label: 'Чувствительность',
          key: 'lymph_nodes_painful_unpainful',
          type: 'select',
          selectList: [
            {name: 'н/у', id: 0},
            {name: 'безболезнен.', id: 1},
            {name: 'болезнен.', id: 2},
          ],
        },
      ]
    },
    {
      block: 'tonsils',
      descriptions: [
        {
          label: 'Миндалины',
          key: 'almonds_normal_large',
          type: 'select',
          selectList: [
            {name: 'н/у', id: 0},
            {name: 'не увеличены.', id: 1},
            {name: 'увеличены', id: 2},
          ],
        },
        {
          label: 'налеты',
          key: 'almonds_plaque',
          type: 'checkbox',
        },
      ]
    },
    {
      block: 'throat',
      descriptions: [
        {
          label: 'Слизистая зева',
          key: 'multiple_zeva_clean_hyper',
          type: 'select',
          selectList: [
            {name: 'н/у', id: 0},
            {name: 'чистая', id: 1},
            {name: 'гиперемированная', id: 2},
          ],
        },
      ]
    },
    {
      block: 'perc',
      descriptions: [
        {
          label: 'Перкуторно над легким звук',
          key: 'perc_lungs_sound_id',
          type: 'dict',
          shortDict: true,
          dictFilters: {type: 'PERC_LUNGS_SOUND'},
          dictFiltersOrder: ['type'],
          bindLabel: 'name',
          bindValue: 'id',
          dict: 'readAllUsingGET_34',
        },
        {
          label: 'Локализ',
          key: 'perc_lungs_sound_text',
          type: 'text',
        },
      ]
    },
    {
      block: 'tongue',
      descriptions: [
        {
          label: 'Обложен',
          key: 'tongue_clean_furred',
          type: 'select',
          selectList: [
            {name: 'н/у', id: 0},
            {name: 'чистый', id: 1},
            {name: 'обложен', id: 2},
          ],
          styleClass: 'col-6',
        },
        {
          label: 'Влажность',
          key: 'tongue_weat_dry',
          type: 'select',
          selectList: [
            {name: 'н/у', id: 0},
            {name: 'влажный', id: 1},
            {name: 'сухой', id: 2},
          ],
          styleClass: 'col-6',
        },
      ]
    },
    {
      block: 'stomach',
      descriptions: [
        {
          label: 'обычной формы',
          key: 'stomach_normal',
          type: 'checkbox',
          styleClass: 'col-6',
        },
        {
          label: 'вздут',
          key: 'stomach_infliat',
          type: 'checkbox',
          styleClass: 'col-6',
        },
        {
          label: 'признаки асцита',
          key: 'stomach_ascites',
          type: 'checkbox',
          styleClass: 'col-6',
        },
        {
          label: 'мягкий',
          key: 'stomach_soft',
          type: 'checkbox',
          styleClass: 'col-6',
        },
        {
          label: 'напряжен',
          key: 'stomach_hard',
          type: 'checkbox',
          styleClass: 'col-6',
        },
        {
          label: 'доскообразный',
          key: 'stomach_disklike',
          type: 'checkbox',
          styleClass: 'col-6',
        },
        {
          label: 'безболезненный',
          key: 'stomach_unpainful',
          type: 'checkbox',
          styleClass: 'col-6',
        },
        {
          label: 'болезненный',
          key: 'stomach_painful',
          type: 'checkbox',
          styleClass: 'col-6',
        },
        {
          label: 'Перетонит',
          key: 'stomach_peritonit',
          type: 'select',
          selectList: [
            {name: 'н/у', id: 0},
            {name: 'да', id: 1},
            {name: 'нет', id: 2},
          ],
          styleClass: 'col-6',
        },
        {
          label: 'Уч-ет в акте дыхания',
          key: 'stomach_breathing_involved',
          type: 'select',
          selectList: [
            {name: 'н/у', id: 0},
            {name: 'да', id: 1},
            {name: 'нет', id: 2},
          ],
          styleClass: 'col-6',
        },
        {
          label: 'Примечания',
          key: 'stomach_text',
          type: 'text',
        },
      ]
    },
    {
      block: 'breath',
      descriptions: [
        {
          label: 'везикулярное',
          key: 'breath_vesicul',
          type: 'checkbox',
          styleClass: 'col-6',
        },
        {
          label: 'равномерно провод. во все отд.',
          key: 'breath_evenlt',
          type: 'checkbox',
          styleClass: 'col-6',
        },
        {
          label: 'пуэрильное',
          key: 'breath_puer',
          type: 'checkbox',
          styleClass: 'col-6',
        },
        {
          label: 'ослабленное',
          key: 'breath_weak',
          type: 'checkbox',
          styleClass: 'col-6',
        },
        {
          label: 'жесткое',
          key: 'breath_hard',
          type: 'checkbox',
          styleClass: 'col-6',
        },
        {
          label: 'бронхиальное',
          key: 'breath_bronch',
          type: 'checkbox',
          styleClass: 'col-6',
        },
        {
          label: 'отсутсвует',
          key: 'breath_absent',
          type: 'checkbox',
          styleClass: 'col-6',
        },
        {
          label: 'Одышка',
          key: 'dyspnea_id',
          type: 'dict',
          shortDict: true,
          dictFilters: {type: 'DYSPNEA'},
          dictFiltersOrder: ['type'],
          bindLabel: 'name',
          bindValue: 'id',
          dict: 'readAllUsingGET_34',
        },
        {
          label: 'Локализ измен. дых.',
          key: 'breath_text',
          type: 'textarea',
          rows: 4,
        },
      ]
    },
    {
      block: 'wheezing',
      descriptions: [
        {
          label: 'Тип',
          key: 'lungs_wheezing_id',
          type: 'dict',
          shortDict: true,
          dictFilters: {type: 'LUNGS_WHEEZING'},
          dictFiltersOrder: ['type'],
          bindLabel: 'name',
          bindValue: 'id',
          dict: 'readAllUsingGET_34',
        },
        {
          label: 'Локализ',
          key: 'lungs_wheezing_text',
          type: 'text',
        },
      ]
    },
    {
      block: 'liver',
      descriptions: [
        {
          label: 'Печень',
          key: 'liver_normal_large',
          type: 'select',
          selectList: [
            {name: 'н/у', id: 0},
            {name: 'не увеличена', id: 1},
            {name: 'увеличена', id: 2},
          ],
        },
        {
          label: 'с-м Ортнера',
          key: 'liver_ortner',
          type: 'checkbox',
        },
      ]
    },
    {
      block: 'dyspeptic',
      descriptions: [
        {
          label: 'нет',
          key: 'dyspeptics_no',
          type: 'checkbox',
          styleClass: 'col-6',
        },
        {
          label: 'тошнота',
          key: 'dyspeptics_nausea',
          type: 'checkbox',
          styleClass: 'col-6',
        },
        {
          label: 'рвота',
          key: 'dyspeptics_retch',
          type: 'checkbox',
          styleClass: 'col-6',
        },
        {
          label: 'диарея',
          key: 'dyspeptics_diarrhea',
          type: 'checkbox',
          styleClass: 'col-6',
        },
      ]
    },
    {
      block: 'diuresis',
      descriptions: [
        {
          label: 'N',
          key: 'diuresis_n',
          type: 'checkbox',
          styleClass: 'col-6',
        },
        {
          label: 'дизурия',
          key: 'diuresis_disuria',
          type: 'checkbox',
          styleClass: 'col-6',
        },
        {
          label: 'слева',
          key: 'diuresis_left',
          type: 'checkbox',
          styleClass: 'col-6',
        },
        {
          label: 'олигурия',
          key: 'diuresis_oliguria',
          type: 'checkbox',
          styleClass: 'col-6',
        },
        {
          label: 'гематургия',
          key: 'diuresis_hematuria',
          type: 'checkbox',
          styleClass: 'col-6',
        },
        {
          label: 'справа',
          key: 'diuresis_right',
          type: 'checkbox',
          styleClass: 'col-6',
        },
      ]
    },
    {
      block: 'alcohol',
      descriptions: [
        {
          label: 'эмоциональная лабильность',
          key: 'alco_emotion_lability',
          type: 'checkbox',
        },
        {
          label: 'речь и поведение пьяного человека',
          key: 'alco_speach_behavior',
          type: 'checkbox',
        },
        {
          label: 'неадекватная оценка происходящей ситуации',
          key: 'alco_inadequate',
          type: 'checkbox',
        },
        {
          label: 'запах алкоголя в выдыхаемом воздухе',
          key: 'alco_breath',
          type: 'checkbox',
        },
        {
          label: 'шаткая походка',
          key: 'alco_shaky_walk',
          type: 'checkbox',
        },
        {
          label: 'неустойчивость в позе Ромберга',
          key: 'alco_romberg_pose',
          type: 'checkbox',
        },
      ]
    },
    {
      block: 'excreta',
      descriptions: [
        {
          label: 'Стул',
          key: 'excreta',
          type: 'select',
          selectList: [
            {name: 'н/у', id: 0},
            {name: 'оформлен', id: 1},
            {name: 'не оформлен', id: 2},
          ],
        },
        {
          label: 'Частота',
          key: 'excreta_text',
          type: 'text',
        },
        {
          label: 'Мочеиспускание',
          key: 'urine_text',
          type: 'textarea',
          rows: 4,
        },
      ]
    },
    {
      block: 'reflexes',
      descriptions: [
        {
          label: 'Соотношение',
          key: 'reflexes_d_s_id',
          type: 'dict',
          shortDict: true,
          dictFilters: {type: 'REFLEXES_D_S'},
          dictFiltersOrder: ['type'],
          bindLabel: 'name',
          bindValue: 'id',
          dict: 'readAllUsingGET_34',
          styleClass: 'col-6',
        },
        {
          label: 'Рефлексы',
          key: 'tendon_reflexes_id',
          type: 'dict',
          shortDict: true,
          dictFilters: {type: 'TENDON_REFLEXES'},
          dictFiltersOrder: ['type'],
          bindLabel: 'name',
          bindValue: 'id',
          dict: 'readAllUsingGET_34',
          styleClass: 'col-6',
        },
        {
          label: 'Менингеальные',
          key: 'meningeal_reflexes',
          type: 'checkbox',
        },
        {
          label: 'Патологические',
          key: 'pathological_reflexes',
          type: 'checkbox',
        },
      ]
    },
    {
      block: 'addition',
      descriptions: [
        {
          key: 'addition_objective',
          type: 'textarea',
          rows: 4,
        }
      ]
    },
  ];
  descriptions: ISimpleDescription[] = [
      {
        label: 'Тип',
        key: '',
        type: 'dict',
        shortDict: true,
        dictFilters: {type: 'GENERAL_STATE'},
        dictFiltersOrder: ['type'],
        bindLabel: 'name',
        bindValue: 'id',
        dict: 'readAllUsingGET_34',
        styleClass: 'col-4',
        additional: {
          block: 'general_state'
        }
      },
      {
        label: 'Сознание',
        key: '',
        type: 'dict',
        shortDict: true,
        dictFilters: {type: 'CONSCIOUS'},
        dictFiltersOrder: ['type'],
        bindLabel: 'name',
        bindValue: 'id',
        dict: 'readAllUsingGET_34',
        styleClass: 'col-4',
        additional: {
          block: 'general_state'
        }
      },
      {
        label: 'Поведение',
        key: '',
        type: 'dict',
        shortDict: true,
        dictFilters: {type: 'BEHAVIOUR'},
        dictFiltersOrder: ['type'],
        bindLabel: 'name',
        bindValue: 'id',
        dict: 'readAllUsingGET_34',
        styleClass: 'col-4',
        additional: {
          block: 'general_state'
        }
      },
      {
        label: 'Речевая реакция: ',
        key: '',
        type: 'select',
        styleClass: 'line-form  col-12',
        selectList: [
          {name: 'Правильная речь', id: 5},
          {name: 'Спутанная речь', id: 4},
          {name: 'Членораздельная речь (отдельный набор слов)', id: 3},
          {name: 'Нечленораздельная речь (непонятные звуки)', id: 2},
          {name: 'Отсутствие речевой продукции', id: 1},
        ],
        additional: {
          block: 'glasgow'
        },
      },
    {
      label: 'Речевая реакция: ',
      key: '',
      type: 'select',
      styleClass: 'line-form  col-12',
      selectList: [
        {name: 'Ребенок улыбается, ориентируется на звук, следит за объектами, интерактивен', id: 5},
        {name: 'Ребенка при плаче можно успокоить, интерактивность неполноценная', id: 4},
        {name: 'При плаче успокаивается, но ненадолго, стонет', id: 3},
        {name: 'Не успокаивается при плаче, беспокоен', id: 2},
        {name: 'Плач и интерактивность отсутствуют', id: 1},
      ],
      additional: {
        block: 'glasgow'
      },
    },
      {
        label: 'Двигательная реакция: ',
        key: '',
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
        key: '',
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
        key: '',
        type: 'checkbox',
        additional: {
          block: 'edema'
        }
      },
      {
        label: 'Локализ',
        key: '',
        type: 'text',
        additional: {
          block: 'edema'
        }
      },
      {
        label: 'обычные',
        key: '',
        type: 'checkbox',
        styleClass: 'col-6',
        additional: {
          block: 'skin'
        }
      },
      {
        label: 'бледные',
        key: '',
        type: 'checkbox',
        styleClass: 'col-6',
        additional: {
          block: 'skin'
        }
      },
      {
        label: 'землистые',
        key: '',
        type: 'checkbox',
        styleClass: 'col-6',
        additional: {
          block: 'skin'
        }
      },
      {
        label: 'желтушные',
        key: '',
        type: 'checkbox',
        styleClass: 'col-6',
        additional: {
          block: 'skin'
        }
      },
      {
        label: 'акроцианоз',
        key: '',
        type: 'checkbox',
        styleClass: 'col-6',
        additional: {
          block: 'skin'
        }
      },
      {
        label: 'цианотичные',
        key: '',
        type: 'checkbox',
        styleClass: 'col-6',
        additional: {
          block: 'skin'
        }
      },
      {
        label: 'гиперемированные',
        key: '',
        type: 'checkbox',
        styleClass: 'col-6',
        additional: {
          block: 'skin'
        }
      },
      {
        label: 'сухие',
        key: '',
        type: 'checkbox',
        styleClass: 'col-6',
        additional: {
          block: 'skin'
        }
      },
      {
        label: 'профузный пот',
        key: '',
        type: 'checkbox',
        styleClass: 'col-6',
        additional: {
          block: 'skin'
        }
      },
      {
        label: 'высыпания',
        key: '',
        type: 'checkbox',
        styleClass: 'col-6',
        additional: {
          block: 'skin'
        }
      },
      {
        label: 'мраморность',
        key: '',
        type: 'checkbox',
        styleClass: 'col-6',
        additional: {
          block: 'skin'
        }
      },
      {
        label: 'Пульс',
        key: '',
        type: 'dict',
        shortDict: true,
        dictFilters: {type: 'HEART_RATE'},
        dictFiltersOrder: ['type'],
        bindLabel: 'name',
        bindValue: 'id',
        dict: 'readAllUsingGET_34',
        styleClass: 'col-4',
        additional: {
          block: 'heart'
        }
      },
      {
        label: 'Тоны сердца',
        key: '',
        type: 'dict',
        shortDict: true,
        dictFilters: {type: 'HEART_TONE'},
        dictFiltersOrder: ['type'],
        bindLabel: 'name',
        bindValue: 'id',
        dict: 'readAllUsingGET_34',
        styleClass: 'col-4',
        additional: {
          block: 'heart'
        }
      },
      {
        label: 'Шумы',
        key: '',
        type: 'dict',
        shortDict: true,
        dictFilters: {type: 'HEART_NOISE'},
        dictFiltersOrder: ['type'],
        bindLabel: 'name',
        bindValue: 'id',
        dict: 'readAllUsingGET_34',
        styleClass: 'col-4',
        additional: {
          block: 'heart'
        }
      },
      {
        label: 'ЧСС: ',
        key: '',
        type: 'text',
        styleClass: 'col-4',
        additional: {
          block: 'other'
        }
      },
      {
        label: 'PS: ',
        key: '',
        type: 'text',
        styleClass: 'col-4',
        additional: {
          block: 'other'
        }
      },
      {
        label: 'АД: ',
        key: '',
        type: 'text',
        styleClass: 'col-4',
        additional: {
          block: 'other'
        }
      },
      {
        label: 'АДN: ',
        key: '',
        type: 'text',
        styleClass: 'col-4',
        additional: {
          block: 'other'
        }
      },
      {
        label: 'АД max: ',
        key: '',
        type: 'text',
        styleClass: 'col-4',
        additional: {
          block: 'other'
        }
      },
      {
        label: 't тела: ',
        key: '',
        type: 'text',
        styleClass: 'col-4',
        additional: {
          block: 'other'
        }
      },
      {
        label: 'ЧД: ',
        key: '',
        type: 'text',
        styleClass: 'col-4',
        additional: {
          block: 'other'
        }
      },
      {
        label: 'Глюкометрия: ',
        key: '',
        type: 'text',
        styleClass: 'col-4',
        additional: {
          block: 'other'
        }
      },
      {
        label: 'Sat O2: ',
        key: '',
        type: 'text',
        styleClass: 'col-4',
        additional: {
          block: 'other'
        }
      },
      {
        label: 'Соотношение',
        key: '',
        type: 'dict',
        shortDict: true,
        dictFilters: {type: 'PENALTIES_D_S'},
        dictFiltersOrder: ['type'],
        bindLabel: 'name',
        bindValue: 'id',
        dict: 'readAllUsingGET_34',
        styleClass: 'col-6',
        additional: {
          block: 'pupils'
        }
      },
      {
        label: 'Зрачки',
        key: '',
        type: 'dict',
        shortDict: true,
        dictFilters: {type: 'PENALTIES'},
        dictFiltersOrder: ['type'],
        bindLabel: 'name',
        bindValue: 'id',
        dict: 'readAllUsingGET_34',
        styleClass: 'col-6',
        additional: {
          block: 'pupils'
        }
      },
      {
        label: 'Реакция на свет',
        key: '',
        type: 'select',
        selectList: [
          {name: 'н/у', id: 0},
          {name: 'да', id: 1},
          {name: 'нет', id: 2},
        ],
        additional: {
          block: 'pupils'
        }
      },
      {
        label: 'Анизокрия',
        key: '',
        type: 'select',
        selectList: [
          {name: 'н/у', id: 0},
          {name: 'да', id: 1},
          {name: 'нет', id: 2},
        ],
        additional: {
          block: 'pupils'
        }
      },
      {
        label: 'Нистагм',
        key: '',
        type: 'select',
        selectList: [
          {name: 'н/у', id: 0},
          {name: 'да', id: 1},
          {name: 'нет', id: 2},
        ],
        additional: {
          block: 'pupils'
        }
      },
      {
        label: 'Размер',
        key: '',
        type: 'select',
        selectList: [
          {name: 'н/у', id: 0},
          {name: 'норм.', id: 1},
          {name: 'увелич.', id: 2},
        ],
        additional: {
          block: 'lymph'
        }
      },
      {
        label: 'Локализ',
        key: '',
        type: 'text',
        additional: {
          block: 'lymph'
        }
      },
      {
        label: 'Чувствительность',
        key: '',
        type: 'select',
        selectList: [
          {name: 'н/у', id: 0},
          {name: 'безболезнен.', id: 1},
          {name: 'болезнен.', id: 2},
        ],
        additional: {
          block: 'lymph'
        }
      },
      {
        label: 'Миндалины',
        key: '',
        type: 'select',
        selectList: [
          {name: 'н/у', id: 0},
          {name: 'не увеличены.', id: 1},
          {name: 'увеличены', id: 2},
        ],
        additional: {
          block: 'tonsils'
        }
      },
      {
        label: 'налеты',
        key: '',
        type: 'checkbox',
        additional: {
          block: 'tonsils'
        }
      },
      {
        label: 'Слизистая зева',
        key: '',
        type: 'select',
        selectList: [
          {name: 'н/у', id: 0},
          {name: 'чистая', id: 1},
          {name: 'гиперемированная', id: 2},
        ],
        additional: {
          block: 'throat'
        }
      },
      {
        label: 'Перкуторно над легким звук',
        key: '',
        type: 'dict',
        shortDict: true,
        dictFilters: {type: 'PERC_LUNGS_SOUND'},
        dictFiltersOrder: ['type'],
        bindLabel: 'name',
        bindValue: 'id',
        dict: 'readAllUsingGET_34',
        additional: {
          block: 'perc'
        }
      },
      {
        label: 'Локализ',
        key: '',
        type: 'text',
        additional: {
          block: 'perc'
        }
      },
      {
        label: 'Обложен',
        key: '',
        type: 'select',
        selectList: [
          {name: 'н/у', id: 0},
          {name: 'чистый', id: 1},
          {name: 'обложен', id: 2},
        ],
        styleClass: 'col-6',
        additional: {
          block: 'tongue'
        }
      },
      {
        label: 'Влажность',
        key: '',
        type: 'select',
        selectList: [
          {name: 'н/у', id: 0},
          {name: 'влажный', id: 1},
          {name: 'сухой', id: 2},
        ],
        styleClass: 'col-6',
        additional: {
          block: 'tongue'
        }
      },
      {
        label: 'обычной формы',
        key: '',
        type: 'checkbox',
        styleClass: 'col-6',
        additional: {
          block: 'stomach'
        }
      },
      {
        label: 'вздут',
        key: '',
        type: 'checkbox',
        styleClass: 'col-6',
        additional: {
          block: 'stomach'
        }
      },
      {
        label: 'признаки асцита',
        key: '',
        type: 'checkbox',
        styleClass: 'col-6',
        additional: {
          block: 'stomach'
        }
      },
      {
        label: 'мягкий',
        key: '',
        type: 'checkbox',
        styleClass: 'col-6',
        additional: {
          block: 'stomach'
        }
      },
      {
        label: 'напряжен',
        key: '',
        type: 'checkbox',
        styleClass: 'col-6',
        additional: {
          block: 'stomach'
        }
      },
      {
        label: 'доскообразный',
        key: '',
        type: 'checkbox',
        styleClass: 'col-6',
        additional: {
          block: 'stomach'
        }
      },
      {
        label: 'безболезненный',
        key: '',
        type: 'checkbox',
        styleClass: 'col-6',
        additional: {
          block: 'stomach'
        }
      },
      {
        label: 'болезненный',
        key: '',
        type: 'checkbox',
        styleClass: 'col-6',
        additional: {
          block: 'stomach'
        }
      },
      {
        label: 'Перетонит',
        key: '',
        type: 'select',
        selectList: [
          {name: 'н/у', id: 0},
          {name: 'да', id: 1},
          {name: 'нет', id: 2},
        ],
        styleClass: 'col-6',
        additional: {
          block: 'stomach'
        }
      },
      {
        label: 'Уч-ет в акте дыхания',
        key: '',
        type: 'select',
        selectList: [
          {name: 'н/у', id: 0},
          {name: 'да', id: 1},
          {name: 'нет', id: 2},
        ],
        styleClass: 'col-6',
        additional: {
          block: 'stomach'
        }
      },
      {
        label: 'Примечания',
        key: '',
        type: 'text',
        additional: {
          block: 'stomach'
        }
      },
      {
        label: 'везикулярное',
        key: '',
        type: 'checkbox',
        styleClass: 'col-6',
        additional: {
          block: 'breath'
        }
      },
      {
        label: 'равномерно провод. во все отд.',
        key: '',
        type: 'checkbox',
        styleClass: 'col-6',
        additional: {
          block: 'breath'
        }
      },
      {
        label: 'пуэрильное',
        key: '',
        type: 'checkbox',
        styleClass: 'col-6',
        additional: {
          block: 'breath'
        }
      },
      {
        label: 'ослабленное',
        key: '',
        type: 'checkbox',
        styleClass: 'col-6',
        additional: {
          block: 'breath'
        }
      },
      {
        label: 'жесткое',
        key: '',
        type: 'checkbox',
        styleClass: 'col-6',
        additional: {
          block: 'breath'
        }
      },
      {
        label: 'бронхиальное',
        key: '',
        type: 'checkbox',
        styleClass: 'col-6',
        additional: {
          block: 'breath'
        }
      },
      {
        label: 'отсутсвует',
        key: '',
        type: 'checkbox',
        styleClass: 'col-6',
        additional: {
          block: 'breath'
        }
      },
      {
        label: 'Одышка',
        key: '',
        type: 'dict',
        shortDict: true,
        dictFilters: {type: 'DYSPNEA'},
        dictFiltersOrder: ['type'],
        bindLabel: 'name',
        bindValue: 'id',
        dict: 'readAllUsingGET_34',
        additional: {
          block: 'breath'
        }
      },
      {
        label: 'Локализ измен. дых.',
        key: '',
        type: 'textarea',
        rows: 4,
        additional: {
          block: 'breath'
        }
      },
      {
        label: 'Тип',
        key: '',
        type: 'dict',
        shortDict: true,
        dictFilters: {type: 'LUNGS_WHEEZING'},
        dictFiltersOrder: ['type'],
        bindLabel: 'name',
        bindValue: 'id',
        dict: 'readAllUsingGET_34',
        additional: {
          block: 'wheezing'
        }
      },
      {
        label: 'Локализ',
        key: '',
        type: 'text',
        additional: {
          block: 'wheezing'
        }
      },
      {
        label: 'Печень',
        key: '',
        type: 'select',
        selectList: [
          {name: 'н/у', id: 0},
          {name: 'не увеличена', id: 1},
          {name: 'увеличена', id: 2},
        ],
        additional: {
          block: 'liver'
        }
      },
      {
        label: 'с-м Ортнера',
        key: '',
        type: 'checkbox',
        additional: {
          block: 'liver'
        }
      },
      {
        label: 'нет',
        key: '',
        type: 'checkbox',
        styleClass: 'col-6',
        additional: {
          block: 'dyspeptic'
        }
      },
      {
        label: 'тошнота',
        key: '',
        type: 'checkbox',
        styleClass: 'col-6',
        additional: {
          block: 'dyspeptic'
        }
      },
      {
        label: 'рвота',
        key: '',
        type: 'checkbox',
        styleClass: 'col-6',
        additional: {
          block: 'dyspeptic'
        }
      },
      {
        label: 'диарея',
        key: '',
        type: 'checkbox',
        styleClass: 'col-6',
        additional: {
          block: 'dyspeptic'
        }
      },
      {
        label: 'N',
        key: '',
        type: 'checkbox',
        styleClass: 'col-6',
        additional: {
          block: 'diuresis'
        }
      },
      {
        label: 'дизурия',
        key: '',
        type: 'checkbox',
        styleClass: 'col-6',
        additional: {
          block: 'diuresis'
        }
      },
      {
        label: 'слева',
        key: '',
        type: 'checkbox',
        styleClass: 'col-6',
        additional: {
          block: 'diuresis'
        }
      },
      {
        label: 'олигурия',
        key: '',
        type: 'checkbox',
        styleClass: 'col-6',
        additional: {
          block: 'diuresis'
        }
      },
      {
        label: 'гематургия',
        key: '',
        type: 'checkbox',
        styleClass: 'col-6',
        additional: {
          block: 'diuresis'
        }
      },
      {
        label: 'справа',
        key: '',
        type: 'checkbox',
        styleClass: 'col-6',
        additional: {
          block: 'diuresis'
        }
      },
      {
        label: 'эмоциональная лабильность',
        key: '',
        type: 'checkbox',
        additional: {
          block: 'alcohol'
        }
      },
      {
        label: 'речь и поведение пьяного человека',
        key: '',
        type: 'checkbox',
        additional: {
          block: 'alcohol'
        }
      },
      {
        label: 'неадекватная оценка происходящей ситуации',
        key: '',
        type: 'checkbox',
        additional: {
          block: 'alcohol'
        }
      },
      {
        label: 'запах алкоголя в выдыхаемом воздухе',
        key: '',
        type: 'checkbox',
        additional: {
          block: 'alcohol'
        }
      },
      {
        label: 'шаткая походка',
        key: '',
        type: 'checkbox',
        additional: {
          block: 'alcohol'
        }
      },
      {
        label: 'неустойчивость в позе Ромберга',
        key: '',
        type: 'checkbox',
        additional: {
          block: 'alcohol'
        }
      },
      {
        label: 'Стул',
        key: '',
        type: 'select',
        selectList: [
          {name: 'н/у', id: 0},
          {name: 'оформлен', id: 1},
          {name: 'не оформлен', id: 2},
        ],
        additional: {
          block: 'excreta'
        }
      },
      {
        label: 'Частота',
        key: '',
        type: 'text',
        additional: {
          block: 'excreta'
        }
      },
      {
        label: 'Мочеиспускание',
        key: '',
        type: 'textarea',
        rows: 4,
        additional: {
          block: 'excreta'
        }
      },
      {
        label: 'Соотношение',
        key: '',
        type: 'dict',
        shortDict: true,
        dictFilters: {type: 'REFLEXES_D_S'},
        dictFiltersOrder: ['type'],
        bindLabel: 'name',
        bindValue: 'id',
        dict: 'readAllUsingGET_34',
        styleClass: 'col-6',
        additional: {
          block: 'reflexes'
        }
      },
      {
        label: 'Рефлексы',
        key: '',
        type: 'dict',
        shortDict: true,
        dictFilters: {type: 'TENDON_REFLEXES'},
        dictFiltersOrder: ['type'],
        bindLabel: 'name',
        bindValue: 'id',
        dict: 'readAllUsingGET_34',
        styleClass: 'col-6',
        additional: {
          block: 'reflexes'
        }
      },
      {
        label: 'Менингеальные',
        key: '',
        type: 'checkbox',
        additional: {
          block: 'reflexes'
        }
      },
      {
        label: 'Патологические',
        key: '',
        type: 'checkbox',
        additional: {
          block: 'reflexes'
        }
      },
      {
        key: '',
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
              private cas: CardItemService) { }

  ngOnInit() {
    this.forms.forEach(
      f => {
        f.form = this.sds.makeForm(f.descriptions);
        // f.form.valueChanges.subscribe(
        //   el => console.log(el)
        // );
      }
    );
    this.sbscs.push(
      this.route.data.subscribe(data => {
        this.objective = data.cardInfo.objective;
        console.log('->' , this.objective);
      }),
      this.route.parent.paramMap.subscribe(data => {
        this.cardId = data.get('cardId');
      }),
    );
    this.getPatientYear();
  }

  ngOnDestroy() {
    this.sbscs.forEach(el => el.unsubscribe());
  }

  getPatientYear() {
    this.cas.getPatient(this.cardId).subscribe(
      data => {
        this.patientYear = data.patient_age_years;
      }
    );
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
          form =  f.form;
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
    let objective = {};
    Object.keys(this.objective).forEach(
      key => {
        Object.assign(objective, this.getBlockFormValues(key));
      }
    );
    console.log('save', objective);
    this.cas.saveObjective(this.cardId, objective).subscribe(
      res => {
        this.ns.success('Успешно', 'Данные сохранены');
        this.objective = res;
      },
      err => {
        this.ns.error('Ошибка', 'Не удалось сохранить изменения на сервере');
        console.log('Save Objective', err);
      }
    );
  }
}
