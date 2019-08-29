import {ISimpleDescription} from '../../shared/simple-control/services/simple-description.service';
import {ColDef} from 'ag-grid-community';
import {IConditions} from "../../shared/services/check-condition.service";

export interface IDictItem {
  title: string;
  method: string; // метод получения элемента справочника
  saveMethod: string; // метод сохранения элемента справочника
  restoreMethod?: string; // метод восстановления удаленного элемента справочника
  deleteMethod?: string; // метод восстановления удаления элемента справочника
  blocks?: {title: string, key: string}[]; // список блоков полей (для разных descriptions: ISimpleDescription[])
  conditions?: IConditions; // условия для сравнения разных полей и валидации их
  descriptions: ISimpleDescription[];
}

export interface IHeadersTreeTable {
  header: string,
  width: string
}

export interface IDictionaryInfo {
  title: string; // Наименование справочника
  type: string; // list, tree
  headers?: IHeadersTreeTable[];
  method: string; // method api
  name: string; // имя для роутера
  colDef?: ColDef[];
  block: string;
  item: IDictItem;
  params?: any; // параметры запроса
  paramsOrder?: string[]; // порядок параметров
}

const dictionaries: IDictionaryInfo[] = [
  {
    title: 'Активные посещения',
    type: 'list',
    name: 'active-visit',
    method: 'getReferenceTypeListActiveVisitUsingGET',
    block: 'common',
    colDef: [
      {
        headerName: 'Код',
        field: 'code',
        width: 150,
      },
      {
        headerName: 'Наименование',
        field: 'name',
        width: 400
      }
    ],
    item: {
      title: 'Активное посещение',
      descriptions: [
        {
          label: 'Тип',
          key: 'type',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'common'
          },
          hide: true,
          presetValue: 'ACTIVE_VISIT'
        },
        {
          label: 'Код:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'common'
          }
        },
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'common'
          }
        },

      ],
      blocks: [{title: '', key: 'common'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE'
    }
  },
  {
    title: 'Подразделения',
    name: 'subdivisions',
    type: 'tree',
    method: 'getFullSubdivisionNodeUsingGET',
    block: 'common',
    headers: [
      {
        header: '',
        width: '95%'
      }
    ],
    item: {
      title: 'Подразделение',
      descriptions: [
        {
          label: 'Тип',
          key: 'typeFK',
          type: 'dict',
          dict: 'getSubdivisionTypeListUsingGET',
          dictFilters: {name: '', code: ''},
          dictFiltersOrder: ['name', 'code'],
          required: true,
          additional: {
            block: 'general'
          }
        },
        {
          label: 'Код:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'general'
          }
        },
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'general'
          }
        },
        {
          label: 'Район',
          key: '',
          type: 'dict',
          dict: '',
          dictFiltersOrder: ['type'],
          additional: {
            block: 'address'
          }
        },
        {
          label: 'Населенный пункт',
          key: '',
          type: 'dict',
          dict: '',
          dictFiltersOrder: ['type'],
          styleClass: 'col-6',
          additional: {
            block: 'address'
          }
        },
        {
          label: 'Улица',
          key: '',
          type: 'dict',
          dict: '',
          dictFiltersOrder: ['type'],
          styleClass: 'col-6',
          additional: {
            block: 'address'
          }
        },
        {
          label: 'Дом',
          key: '',
          type: 'dict',
          dict: '',
          dictFiltersOrder: ['type'],
          styleClass: 'col-4',
          additional: {
            block: 'address'
          }
        },
        {
          label: 'Корпус',
          key: 'building',
          type: 'text',
          styleClass: 'col-4',
          additional: {
            block: 'address'
          }
        },
        {
          label: 'Лит./Стр',
          key: 'structure',
          type: 'text',
          styleClass: 'col-4',
          additional: {
            block: 'address'
          }
        },
        {
          label: 'Телефон',
          key: 'phone',
          type: 'number',
          errorText: 'Некорректный номер',
          additional: {
            block: 'contactInfo'
          }
        },
        {
          label: 'E-mail',
          key: 'email',
          errorText: 'Неверный формат почты',
          pattern: '^\\w+[\\w-\\.]*\\@\\w+((-\\w+)|(\\w*))\\.[a-z]{2,3}$',
          required: true,
          type: 'text',
          additional: {
            block: 'contactInfo'
          }
        },
        {
          label: 'Удаленная запись',
          key: 'isDeleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'contactInfo'
          }
        }
      ],
      blocks: [
        {title: 'Общие сведения', key: 'general'},
        {title: 'Адрес', key: 'address'},
        {title: 'Контактные данные', key: 'contactInfo'},
      ],
      method: 'getSubdivisionUsingGET',
      saveMethod: 'updateSubdivisionUsingPOST',
      restoreMethod: 'restoreSubdivisionUsingPOST',
      deleteMethod: 'deleteSubdivisionUsingDELETE'
    }
  },
  {
    title: 'Больницы',
    type: 'list',
    name: 'hospitals',
    method: 'getSubdivisionListUsingGET',
    params: {type: [1558]},
    paramsOrder: ['type'],
    block: 'common',
    colDef: [
      {
        headerName: 'Код',
        field: 'code',
        width: 150,
      },
      {
        headerName: 'Наименование',
        field: 'name',
        width: 400
      }
    ],
    item: {
      title: 'Больница',
      descriptions: [
        {
          label: 'Тип',
          hide: true,
          key: 'typeFK',
          type: 'dict',
          dict: 'getSubdivisionTypeListUsingGET',
          // alwaysDisabled: true,
          required: true,
          readonly: true,
          additional: {
            block: 'general'
          },
          presetValue: {
            isDeleted: false,
            code: 'HOSPITAL',
            id: 1558,
            parentId: null,
            name: 'Больница'
          }
        },
        {
          label: 'Код:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'general'
          }
        },
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'general'
          }
        },
        // {
        //   label: 'Район',
        //   key: '',
        //   type: 'dict',
        //   dict: 'readAllUsingGET_10',
        //   dictFiltersOrder: ['type'],
        //   additional: {
        //     block: 'address'
        //   }
        // },
        {
          label: 'Улица',
          key: '',
          type: 'dict',
          dict: '',
          dictFiltersOrder: ['type'],
          additional: {
            block: 'address'
          }
        },
        {
          label: 'Телефон',
          key: 'phone',
          type: 'number',
          errorText: 'Некорректный номер',
          additional: {
            block: 'contactInfo'
          }
        },
        {
          label: 'E-mail',
          key: 'email',
          errorText: 'Неверный формат почты',
          pattern: '^\\w+[\\w-\\.]*\\@\\w+((-\\w+)|(\\w*))\\.[a-z]{2,3}$',
          required: true,
          type: 'text',
          additional: {
            block: 'contactInfo'
          }
        },
        {
          label: 'Web-сайт',
          key: 'website',
          errorText: 'Неверный формат сайта',
          pattern: '^(https?:\\/\\/)?(www\\.)?([a-zA-Z0-9]+(-?[a-zA-Z0-9])*\\.)+[\\w]{2,}(\\/\\S*)?$',
          required: true,
          type: 'text',
          additional: {
            block: 'contactInfo'
          }
        },
        {
          label: 'Удаленная запись',
          key: 'isDeleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'deleted'
          }
        }
      ],
      blocks: [
        {title: 'Общие сведения', key: 'general'},
        {title: 'Адрес', key: 'address'},
        {title: 'Контактная информация', key: 'contactInfo'},
        {title: '', key: 'deleted'},
      ],
      method: 'getSubdivisionUsingGET',
      saveMethod: 'updateSubdivisionUsingPOST',
      restoreMethod: 'restoreSubdivisionUsingPOST',
      deleteMethod: 'deleteSubdivisionUsingDELETE'
    }
  },
  {
    title: 'Типы графиков',
    type: 'list',
    name: 'schedule-types',
    method: 'getScheduleTypeListUsingGET',
    block: 'common',
    colDef: [
      {
        headerName: 'Наименование',
        field: 'name',
        width: 135,
      },
      {
        headerName: 'Начало',
        field: 'timeFrom',
        width: 135,
      },
      {
        headerName: 'Длительность',
        field: 'workingMinutes',
        width: 145,
      },
      {
        headerName: 'Рабочих дней',
        field: 'workingDays',
        width: 135,
      },
      {
        headerName: 'Выходных дней',
        field: 'daysOff',
        width: 145,
      },
    ],
    item: {
      title: 'График',
      conditions: {
        diff_time: {
          first: 'timeFrom',
          second: 'timeTo',
          result: 'workingMinutes'
        },
        value_from_fields: {
          first: 'workingDays',
          second: 'daysOff',
          result: 'name',
          separator: '/'
        }
      },
      descriptions: [
        {
          label: 'Наименование',
          key: 'name',
          type: 'text',
          readonly: true,
          required: true,
          additional: {
            block: 'common'
          }
        },
        {
          label: 'Код:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'common'
          }
        },
        {
          label: 'Рабочих дней',
          key: 'workingDays',
          type: 'number',
          required: true,
          pattern: '^[1-9][0-9]*',
          errorText: 'Поле не может быть пустым или нулем',
          additional: {
            block: 'common'
          }
        },
        {
          label: 'Выходных дней',
          key: 'daysOff',
          type: 'number',
          required: true,
          pattern: '^[1-9][0-9]*',
          errorText: 'Поле не может быть пустым или нулем',
          additional: {
            block: 'common'
          }
        },
        {
          label: 'Начало рабочего дня',
          key: 'timeFrom',
          errorText: 'Не соответствует формату: HH:mm',
          pattern: '^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$',
          type: 'text',
          required: true,
          additional: {
            block: 'common'
          }
        },
        {
          label: 'Конец рабочего дня',
          key: 'timeTo',
          errorText: 'Не соответствует формату: HH:mm',
          pattern: '^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$',
          type: 'text',
          required: true,
          additional: {
            block: 'common'
          }
        },
        {
          label: 'Рабочих часов',
          key: 'workingMinutes',
          type: 'text',
          readonly: true,
          required: true,
          additional: {
            block: 'common'
          }
        },

      ],
      blocks: [{title: '', key: 'common'}],
      method: 'getScheduleTypeUsingGET',
      saveMethod: 'updateScheduleTypeUsingPOST',
      restoreMethod: 'restoreScheduleTypeUsingPOST',
      deleteMethod: 'deleteScheduleTypeUsingDELETE'
    }
  },
  {
    title: 'Транспорты',
    type: 'list',
    name: 'transport',
    method: 'getTransportListUsingGET',
    block: 'common',
    colDef: [
      {
        headerName: 'Гос. номер',
        field: 'code',
        width: 150,
      },
      {
        headerName: 'Марка',
        field: 'name',
        width: 200
      },
      {
        headerName: 'Цвет',
        field: 'color',
        width: 200
      },
    ],
    item: {
      title: 'Транспорт',
      descriptions: [
        {
          label: 'Гос. номер:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'common'
          }
        },
        {
          label: 'Марка:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'common'
          }
        },
        {
          label: 'Цвет:',
          key: 'color',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'common'
          }
        },

      ],
      blocks: [
        {title: '', key: 'common'},
      ],
      method: 'getTransportUsingGET',
      saveMethod: 'updateTransportUsingPOST',
      restoreMethod: 'restoreTransportUsingPOST',
      deleteMethod: 'deleteTransportUsingDELETE'
    }
  },
  {
    title: 'Сотрудники',
    type: 'list',
    name: 'performers',
    method: 'getPerformerListUsingGET',
    block: 'common',
    colDef: [
      {
        headerName: 'Фамилия',
        field: 'surname',
      },
      {
        headerName: 'Имя',
        field: 'name',
      },
      {
        headerName: 'Отчество',
        field: 'patronymic',
      },
      {
        headerName: 'Должность',
        field: 'typeFK.name',
      },
      {
        headerName: 'Место работы',
        field: 'workplaceSubdivisionFK.name',
      },
      {
        headerName: 'Логин',
        field: 'login',
      },

    ],
    item: {
      title: 'Сотрудник',
      descriptions: [
        {
          label: 'Фамилия:',
          key: 'surname',
          type: 'text',
          errorText: 'Только кириллица',
          pattern: '^[а-яА-ЯёЁ\\s-]*',
          styleClass: 'col-4',
          additional: {
            block: 'common'
          }
        },
        {
          label: 'Имя:',
          key: 'name',
          type: 'text',
          errorText: 'Только кириллица',
          pattern: '^[а-яА-ЯёЁ\\s-]*',
          styleClass: 'col-4',
          additional: {
            block: 'common'
          }
        },        {
          label: 'Отчество:',
          key: 'patronymic',
          type: 'text',
          errorText: 'Только кириллица',
          pattern: '^[а-яА-ЯёЁ\\s-]*',
          styleClass: 'col-4',
          additional: {
            block: 'common'
          }
        },
        {
          label: 'Должность:',
          key: 'typeFK',
          dict: 'getPerformerTypeListUsingGET',
          type: 'dict',
          styleClass: '',
          additional: {
            block: 'common'
          }
        },
        // {
        //   label: 'Место работы:',
        //   key: 'workpalceSubdivisionFK',
        //   type: 'text',
        //   styleClass: '',
        //   additional: {
        //     block: 'common'
        //   }
        // },
        {
          label: 'Подразделение:',
          key: 'subdivisionFK',
          dict: 'getSubdivisionListUsingGET',
          type: 'dict',
          styleClass: '',
          additional: {
            block: 'common'
          }
        },
        {
          label: 'Логин:',
          key: 'login',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'common'
          }
        },

      ],
      blocks: [{title: '', key: 'common'}],
      method: 'getPerformerUsingGET',
      saveMethod: 'updatePerformerUsingPOST',
      restoreMethod: 'restorePerformerUsingPOST',
      deleteMethod: 'deletePerformerUsingDELETE'
    }
  },
  {
    title: 'Должности',
    type: 'list',
    name: 'performer-types',
    method: 'getPerformerTypeListUsingGET',
    block: 'common',
    colDef: [
      {
        headerName: 'Код',
        field: 'code',
        width: 150,
      },
      {
        headerName: 'Наименование',
        field: 'name',
        width: 400
      }
    ],
    item: {
      title: 'Должность',
      descriptions: [
        {
          label: 'Код:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'common'
          }
        },
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'common'
          }
        },

      ],
      blocks: [{title: '', key: 'common'}],
      method: 'getPerformerTypeUsingGET',
      saveMethod: 'updatePerformerTypeUsingPOST',
      restoreMethod: 'restorePerformerTypeUsingPOST',
      deleteMethod: 'deletePerformerTypeUsingDELETE'
    }
  },
  {
    title: 'Специализации',
    type: 'list',
    name: 'skills',
    method: 'getSkillListUsingGET',
    block: 'common',
    colDef: [
      {
        headerName: 'Код',
        field: 'code',
        width: 150,
      },
      {
        headerName: 'Наименование',
        field: 'name',
        width: 400
      }
    ],
    item: {
      title: 'Специализация',
      descriptions: [
        {
          label: 'Код:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'common'
          }
        },
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'common'
          }
        },

      ],
      blocks: [{title: '', key: 'common'}],
      method: 'getSkillUsingGET',
      saveMethod: 'updateSkillUsingPOST',
      restoreMethod: 'restoreSkillUsingPOST',
      deleteMethod: 'deleteSkillUsingDELETE'
    }
  },
  {
    title: 'Типы бригад',
    type: 'list',
    name: 'brigades-types',
    method: 'readBrigadeTypeListUsingGET',
    block: 'brigades',
    colDef: [
      {
        headerName: 'Код',
        field: 'code',
        width: 150,
      },
      {
        headerName: 'Наименование',
        field: 'name',
        width: 400
      }
    ],
    item: {
      title: 'Тип бригады',
      descriptions: [
        {
          label: 'Код:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'brigades'
          }
        },
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'brigades'
          }
        },
        {
          label: 'Удаленная запись',
          key: 'isDeleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'brigades'
          }
        }
      ],
      blocks: [{title: '', key: 'brigades'}],
      method: 'getBrigadeTypeUsingGET',
      saveMethod: 'updateBrigadeTypeUsingPOST',
      restoreMethod: 'restoreBrigadeTypeUsingPOST',
      deleteMethod: 'deleteBrigadeTypeUsingDELETE'
    }
  },
  {
    title: 'Типы передач',
    type: 'list',
    name: 'brigade-receiving',
    method: 'getReferenceTypeListReceivingTypeUsingGET',
    block: 'brigades',
    colDef: [
      {
        headerName: 'Код',
        field: 'code',
        width: 150,
      },
      {
        headerName: 'Наименование',
        field: 'name',
        width: 400
      }
    ],
    item: {
      title: 'Тип передачи',
      descriptions: [
        {
          label: 'Тип',
          key: 'type',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'brigades'
          },
          hide: true,
          presetValue: 'RECEIVING_TYPE'
        },
        {
          label: 'Код:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'brigades'
          }
        },
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'brigades'
          }
        },
        {
          label: 'Удаленная запись',
          key: 'isDeleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'brigades'
          }
        }
      ],
      blocks: [{title: '', key: 'brigades'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE'
    }
  },
  {
    title: 'Место вызова бригад',
    type: 'list',
    name: 'brigade-receiving-place',
    method: 'getReferenceTypeListBrigadeReceivingPlaceUsingGET',
    block: 'brigades',
    colDef: [
      {
        headerName: 'Код',
        field: 'code',
        width: 150,
      },
      {
        headerName: 'Наименование',
        field: 'name',
        width: 400
      }
    ],
    item: {
      title: 'Место вызова бригады',
      descriptions: [
        {
          label: 'Тип',
          key: 'type',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'brigades'
          },
          hide: true,
          presetValue: 'BRIGADE_RECEIVING_PLACE'
        },
        {
          label: 'Код:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'brigades'
          }
        },
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'brigades'
          }
        },
        {
          label: 'Удаленная запись',
          key: 'isDeleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'brigades'
          }
        }
      ],
      blocks: [{title: '', key: 'brigades'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE'
    }
  },
  {
    title: 'Причины задержек',
    type: 'list',
    name: 'delay-reason',
    method: 'getReferenceTypeListDelayReasonUsingGET',
    block: 'brigades',
    colDef: [
      {
        headerName: 'Код',
        field: 'code',
        width: 150,
      },
      {
        headerName: 'Наименование',
        field: 'name',
        width: 400
      }
    ],
    item: {
      title: 'Причина задержки',
      descriptions: [
        {
          label: 'Тип',
          key: 'type',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'brigades'
          },
          hide: true,
          presetValue: 'DELAY_REASON'
        },
        {
          label: 'Код:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'brigades'
          }
        },
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'brigades'
          }
        },
        {
          label: 'Удаленная запись',
          key: 'isDeleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'brigades'
          }
        }
      ],
      blocks: [{title: '', key: 'brigades'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE'
    }
  },
  {
    title: 'Типы заявителей',
    type: 'list',
    name: 'declarant-types',
    method: 'getReferenceTypeListDeclarantUsingGET',
    block: 'common',
    colDef: [
      {
        headerName: 'Код',
        field: 'code',
        width: 150,
      },
      {
        headerName: 'Наименование',
        field: 'name',
        width: 400
      }
    ],
    item: {
      title: 'Тип заявителя',
      descriptions: [
        {
          label: 'Тип',
          key: 'type',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'general'
          },
          hide: true,
          presetValue: 'DECLARANT'
        },
        {
          label: 'Код:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'general'
          }
        },
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'general'
          }
        },
        {
          label: 'Удаленная запись',
          key: 'isDeleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'general'
          }
        }
      ],
      blocks: [{title: '', key: 'general'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE'
    }
  },
  {
    title: 'Виды состояний пациентов',
    type: 'list',
    name: 'general-state',
    method: 'getReferenceTypeListGeneralStateUsingGET',
    block: 'common',
    colDef: [
      {
        headerName: 'Код',
        field: 'code',
        width: 150,
      },
      {
        headerName: 'Наименование',
        field: 'name',
        width: 400
      }
    ],
    item: {
      title: 'Вид состояния пациента',
      descriptions: [
        {
          label: 'Тип',
          key: 'type',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'general'
          },
          hide: true,
          presetValue: 'GENERAL_STATE'
        },
        {
          label: 'Код:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'general'
          }
        },
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'general'
          }
        },
        {
          label: 'Удаленная запись',
          key: 'isDeleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'general'
          }
        }
      ],
      blocks: [{title: '', key: 'general'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE'
    }
  },
  {
    title: 'Типы вызовов',
    type: 'list',
    name: 'call-types',
    method: 'getReferenceTypeListCallUsingGET',
    block: 'calls',
    colDef: [
      {
        headerName: 'Код',
        field: 'code',
        width: 150,
      },
      {
        headerName: 'Наименование',
        field: 'name',
        width: 400
      }
    ],
    item: {
      title: 'Тип вызова',
      descriptions: [
        {
          label: 'Тип',
          key: 'type',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'calls'
          },
          hide: true,
          presetValue: 'CALL'
        },
        {
          label: 'Код:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'calls'
          }
        },
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          bindLabel: 'name',
          additional: {
            block: 'calls'
          }
        },
        {
          label: 'Удаленная запись',
          key: 'isDeleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'calls'
          }
        }
      ],
      blocks: [{title: '', key: 'calls'}],
      method: 'getReferenceTypeUsingGET',
      saveMethod: 'updateReferenceTypeUsingPOST',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE'
    }
  },
  {
    title: 'Типы звонков',
    type: 'list',
    name: 'ring-type',
    method: 'getReferenceTypeListRingTypeUsingGET',
    block: 'calls',
    colDef: [
      {
        headerName: 'Код',
        field: 'code',
        width: 150,
      },
      {
        headerName: 'Наименование',
        field: 'name',
        width: 400
      }
    ],
    item: {
      title: 'Тип звонка',
      descriptions: [
        {
          label: 'Тип',
          key: 'type',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'calls'
          },
          hide: true,
          presetValue: 'RING_TYPE'
        },
        {
          label: 'Код:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'calls'
          }
        },
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          bindLabel: 'name',
          additional: {
            block: 'calls'
          }
        },
        {
          label: 'Удаленная запись',
          key: 'isDeleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'calls'
          }
        }
      ],
      blocks: [{title: '', key: 'calls'}],
      method: 'getReferenceTypeUsingGET',
      saveMethod: 'updateReferenceTypeUsingPOST',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE'
    }
  },
  {
    title: 'Места вызовов',
    type: 'list',
    name: 'place-types',
    method: 'getReferenceTypeListCallPlaceUsingGET',
    block: 'calls',
    colDef: [
      {
        headerName: 'Код',
        field: 'code',
        width: 150,
      },
      {
        headerName: 'Наименование',
        field: 'name',
        width: 400
      }
    ],
    item: {
      title: 'Места вызова',
      descriptions: [
        {
          label: 'Тип',
          key: 'type',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'calls'
          },
          hide: true,
          presetValue: 'CALL_PLACE'
        },
        {
          label: 'Код:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'calls'
          }
        },
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'calls'
          }
        },
        {
          label: 'Удаленная запись',
          key: 'isDeleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'calls'
          }
        }
      ],
      blocks: [{title: '', key: 'calls'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE'
    }
  },
  {
    title: 'Опросник "Повод к вызову"',
    type: 'tree',
    name: 'inquirer',
    method: 'getFullNodeUsingGET',
    block: 'calls',
    headers: [
      {
        header: '',
        width: '70%'
      },
      {
        header: '',
        width: '25%'
      }
    ],
    item: {
      title: 'Опросник "Повод к вызову',
      descriptions: [
        {
          label: 'Наименование:',
          key: 'query',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'inquirer'
          }
        },
        {
          label: 'Ответ:',
          key: 'answer',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'inquirer'
          }
        },
        {
          label: 'Причина',
          key: 'reason',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'reasonInquirer'
          }
        },
        {
          label: 'Удаленная запись',
          key: 'isDeleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'inquirer'
          }
        }
      ],
      blocks: [{title: '', key: 'inquirer'}],
      method: 'getInquirerUsingGET',
      saveMethod: 'updateInquirerUsingPOST',
      restoreMethod: 'restoreInquirerUsingPOST',
      deleteMethod: 'deleteInquirerUsingDELETE'
    }
  },
  {
    title: 'Единицы измерения',
    type: 'list',
    name: 'units',
    method: 'getUnitListUsingGET',
    block: 'common',
    colDef: [
      {
        headerName: 'Код',
        field: 'code',
        width: 150,
      },
      {
        headerName: 'Наименование',
        field: 'name',
        width: 400
      }
    ],
    item: {
      title: 'Единица измерения',
      descriptions: [
        {
          label: 'Код:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'general'
          }
        },
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'general'
          }
        },
        {
          label: 'Удаленная запись',
          key: 'deleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'general'
          }
        }
      ],
      blocks: [{title: '', key: 'general'}],
      method: 'getUnitUsingGET',
      saveMethod: 'updateUnitUsingPOST',
      restoreMethod: 'restoreUnitUsingPOST',
      deleteMethod: 'deleteUnitUsingDELETE'
    }
  },
  {
    title: 'МКБ10',
    type: 'tree',
    name: 'mkb10',
    method: 'getFullMkbNodeUsingGET',
    block: 'common',
    headers: [
      {
        header: '',
        width: '100%'
      },
    ],
    item: {
      title: 'МКБ10',
      descriptions: [
        {
          label: 'Код:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'general'
          }
        },
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'general'
          }
        },
        {
          label: 'Дополнительная информация:',
          key: 'additionalInfo',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'general'
          }
        },
        {
          label: 'Удаленная запись',
          key: 'deleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'general'
          }
        }
      ],
      blocks: [{title: '', key: 'general'}],
      method: 'getClassMkbUsingGET',
      saveMethod: 'updateClassMkbUsingPOST',
      restoreMethod: 'restoreClassMkbUsingPOST',
      deleteMethod: 'deleteClassMkbUsingDELETE'
    }
  },
  {
    title: 'Бригады',
    type: 'list',
    name: 'brigades-control',
    method: 'getBrigadeListUsingGET',
    block: 'brigades',
    colDef: [
      {
        headerName: 'Наименование',
        field: 'name',
        width: 270,
      },
      {
        headerName: 'Специализация',
        field: 'brigadeTypeFK.name',
        width: 200,
      },
      {
        headerName: 'Статус',
        field: 'brigadeStatusFK.name',
        width: 300,
      },
    ],
    item: {
      title: 'Бригада',
      descriptions: [
        {
          label: 'Наименование',
          key: 'name',
          type: 'text',
          additional: {
            block: 'brigades'
          }
        },
        {
          label: 'Тип',
          key: 'brigadeTypeFK',
          type: 'dict',
          dict: 'readBrigadeTypeListUsingGET',
          additional: {
            block: 'brigades'
          }
        },
        {
          label: 'Статус',
          key: 'brigadeStatusFK',
          type: 'dict',
          dict: 'getBrigadeStatusListUsingGET',
          additional: {
            block: 'brigades'
          }
        },
        {
          label: 'Удаленная запись',
          key: 'isDeleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'brigades'
          }
        }
      ],
      blocks: [{title: '', key: 'brigades'}],
      method: 'getBrigadeUsingGET',
      saveMethod: 'updateBrigadeUsingPOST',
      restoreMethod: 'restoreBrigadeUsingPOST',
      deleteMethod: 'deleteBrigadeUsingDELETE'
    }
  },
  {
    title: 'Поведение пациентов',
    type: 'list',
    name: 'behaviour',
    method: 'getReferenceTypeListBehaviourUsingGET',
    block: 'objectives',
    colDef: [
      {
        headerName: 'Код',
        field: 'code',
        width: 150,
      },
      {
        headerName: 'Наименование',
        field: 'name',
        width: 400
      }
    ],
    item: {
      title: 'Поведение пациента',
      descriptions: [
        {
          label: 'Тип',
          key: 'type',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          },
          hide: true,
          presetValue: 'BEHAVIOUR'
        },
        {
          label: 'Код:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          }
        },
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          }
        },
        {
          label: 'Удаленная запись',
          key: 'isDeleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'objectives'
          }
        }
      ],
      blocks: [{title: '', key: 'objectives'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE'
    }
  },
  {
    title: 'Осложнения',
    type: 'list',
    name: 'complications',
    method: 'getReferenceTypeListComplicationsUsingGET',
    block: 'objectives',
    colDef: [
      {
        headerName: 'Код',
        field: 'code',
        width: 150,
      },
      {
        headerName: 'Наименование',
        field: 'name',
        width: 400
      }
    ],
    item: {
      title: 'Осложнение',
      descriptions: [
        {
          label: 'Тип',
          key: 'type',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          },
          hide: true,
          presetValue: 'COMPLICATIONS'
        },
        {
          label: 'Код:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          }
        },
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          }
        },
        {
          label: 'Удаленная запись',
          key: 'isDeleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'objectives'
          }
        }
      ],
      blocks: [{title: '', key: 'objectives'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE'
    }
  },
  {
    title: 'Помощь при осложнениях',
    type: 'list',
    name: 'complications-help',
    method: 'getReferenceTypeListComplicationsHelpUsingGET',
    block: 'objectives',
    colDef: [
      {
        headerName: 'Код',
        field: 'code',
        width: 150,
      },
      {
        headerName: 'Наименование',
        field: 'name',
        width: 400
      }
    ],
    item: {
      title: 'Помощь при осложнениях',
      descriptions: [
        {
          label: 'Тип',
          key: 'type',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          },
          hide: true,
          presetValue: 'COMPLICATIONS_HELP'
        },
        {
          label: 'Код:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          }
        },
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          }
        },
        {
          label: 'Удаленная запись',
          key: 'isDeleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'objectives'
          }
        }
      ],
      blocks: [{title: '', key: 'objectives'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE'
    }
  },
  {
    title: 'Сознания',
    type: 'list',
    name: 'conscious',
    method: 'getReferenceTypeListConsciousUsingGET',
    block: 'objectives',
    colDef: [
      {
        headerName: 'Код',
        field: 'code',
        width: 150,
      },
      {
        headerName: 'Наименование',
        field: 'name',
        width: 400
      }
    ],
    item: {
      title: 'Сознание',
      descriptions: [
        {
          label: 'Тип',
          key: 'type',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          },
          hide: true,
          presetValue: 'CONSCIOUS'
        },
        {
          label: 'Код:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          }
        },
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          }
        },
        {
          label: 'Удаленная запись',
          key: 'isDeleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'objectives'
          }
        }
      ],
      blocks: [{title: '', key: 'objectives'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE'
    }
  },
  {
    title: 'Смерть',
    type: 'list',
    name: 'death',
    method: 'getReferenceTypeListDeathUsingGET',
    block: 'objectives',
    colDef: [
      {
        headerName: 'Код',
        field: 'code',
        width: 150,
      },
      {
        headerName: 'Наименование',
        field: 'name',
        width: 400
      }
    ],
    item: {
      title: 'Смерть',
      descriptions: [
        {
          label: 'Тип',
          key: 'type',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          },
          hide: true,
          presetValue: 'DEATH'
        },
        {
          label: 'Код:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          }
        },
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          }
        },
        {
          label: 'Удаленная запись',
          key: 'isDeleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'objectives'
          }
        }
      ],
      blocks: [{title: '', key: 'objectives'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE'
    }
  },
  {
    title: 'Одышка',
    type: 'list',
    name: 'dyspnea',
    method: 'getReferenceTypeListDyspneaUsingGET',
    block: 'objectives',
    colDef: [
      {
        headerName: 'Код',
        field: 'code',
        width: 150,
      },
      {
        headerName: 'Наименование',
        field: 'name',
        width: 400
      }
    ],
    item: {
      title: 'Одышка',
      descriptions: [
        {
          label: 'Тип',
          key: 'type',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          },
          hide: true,
          presetValue: 'DYSPNEA'
        },
        {
          label: 'Код:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          }
        },
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          }
        },
        {
          label: 'Удаленная запись',
          key: 'isDeleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'objectives'
          }
        }
      ],
      blocks: [{title: '', key: 'objectives'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE'
    }
  },
  {
    title: 'Сердечные шумы',
    type: 'list',
    name: 'heart-noise',
    method: 'getReferenceTypeListHeartNoiseUsingGET',
    block: 'objectives',
    colDef: [
      {
        headerName: 'Код',
        field: 'code',
        width: 150,
      },
      {
        headerName: 'Наименование',
        field: 'name',
        width: 400
      }
    ],
    item: {
      title: 'Сердечные шумы',
      descriptions: [
        {
          label: 'Тип',
          key: 'type',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          },
          hide: true,
          presetValue: 'HEART_NOISE'
        },
        {
          label: 'Код:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          }
        },
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          }
        },
        {
          label: 'Удаленная запись',
          key: 'isDeleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'objectives'
          }
        }
      ],
      blocks: [{title: '', key: 'objectives'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE'
    }
  },
  {
    title: 'Пульс',
    type: 'list',
    name: 'heart-rate',
    method: 'getReferenceTypeListHeartRateUsingGET',
    block: 'objectives',
    colDef: [
      {
        headerName: 'Код',
        field: 'code',
        width: 150,
      },
      {
        headerName: 'Наименование',
        field: 'name',
        width: 400
      }
    ],
    item: {
      title: 'Пульс',
      descriptions: [
        {
          label: 'Тип',
          key: 'type',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          },
          hide: true,
          presetValue: 'HEART_RATE'
        },
        {
          label: 'Код:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          }
        },
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          }
        },
        {
          label: 'Удаленная запись',
          key: 'isDeleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'objectives'
          }
        }
      ],
      blocks: [{title: '', key: 'objectives'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE'
    }
  },
  {
    title: 'Сердечный тон',
    type: 'list',
    name: 'heart-tone',
    method: 'getReferenceTypeListHeartToneUsingGET',
    block: 'objectives',
    colDef: [
      {
        headerName: 'Код',
        field: 'code',
        width: 150,
      },
      {
        headerName: 'Наименование',
        field: 'name',
        width: 400
      }
    ],
    item: {
      title: 'Сердечный тон',
      descriptions: [
        {
          label: 'Тип',
          key: 'type',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          },
          hide: true,
          presetValue: 'HEART_TONE'
        },
        {
          label: 'Код:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          }
        },
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          }
        },
        {
          label: 'Удаленная запись',
          key: 'isDeleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'objectives'
          }
        }
      ],
      blocks: [{title: '', key: 'objectives'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE'
    }
  },
  {
    title: 'Инциденты',
    type: 'list',
    name: 'incident',
    method: 'getReferenceTypeListIncidentUsingGET',
    block: 'objectives',
    colDef: [
      {
        headerName: 'Код',
        field: 'code',
        width: 150,
      },
      {
        headerName: 'Наименование',
        field: 'name',
        width: 400
      }
    ],
    item: {
      title: 'Инцидент',
      descriptions: [
        {
          label: 'Тип',
          key: 'type',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          },
          hide: true,
          presetValue: 'INCIDENT'
        },
        {
          label: 'Код:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          }
        },
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          }
        },
        {
          label: 'Удаленная запись',
          key: 'isDeleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'objectives'
          }
        }
      ],
      blocks: [{title: '', key: 'objectives'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE'
    }
  },
  {
    title: 'Интоксикация',
    type: 'list',
    name: 'intoxication',
    method: 'getReferenceTypeListIntoxicationUsingGET',
    block: 'objectives',
    colDef: [
      {
        headerName: 'Код',
        field: 'code',
        width: 150,
      },
      {
        headerName: 'Наименование',
        field: 'name',
        width: 400
      }
    ],
    item: {
      title: 'Интоксикация',
      descriptions: [
        {
          label: 'Тип',
          key: 'type',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          },
          hide: true,
          presetValue: 'INTOXICATION'
        },
        {
          label: 'Код:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          }
        },
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          }
        },
        {
          label: 'Удаленная запись',
          key: 'isDeleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'objectives'
          }
        }
      ],
      blocks: [{title: '', key: 'objectives'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE'
    }
  },
  {
    title: 'Хрипота в легких',
    type: 'list',
    name: 'lungs-wheezing',
    method: 'getReferenceTypeListLungsWheezingUsingGET',
    block: 'objectives',
    colDef: [
      {
        headerName: 'Код',
        field: 'code',
        width: 150,
      },
      {
        headerName: 'Наименование',
        field: 'name',
        width: 400
      }
    ],
    item: {
      title: 'Хрипота в легких',
      descriptions: [
        {
          label: 'Тип',
          key: 'type',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          },
          hide: true,
          presetValue: 'LUNGS_WHEEZING'
        },
        {
          label: 'Код:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          }
        },
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          }
        },
        {
          label: 'Удаленная запись',
          key: 'isDeleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'objectives'
          }
        }
      ],
      blocks: [{title: '', key: 'objectives'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE'
    }
  },
  {
    title: 'Перкуртурный звук над легкими',
    type: 'list',
    name: 'lungs-perc',
    method: 'getReferenceTypeListPercLungsSoundUsingGET',
    block: 'objectives',
    colDef: [
      {
        headerName: 'Код',
        field: 'code',
        width: 150,
      },
      {
        headerName: 'Наименование',
        field: 'name',
        width: 400
      }
    ],
    item: {
      title: 'Хрипота в легких',
      descriptions: [
        {
          label: 'Тип',
          key: 'type',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          },
          hide: true,
          presetValue: 'PERC_LUNGS_SOUND'
        },
        {
          label: 'Код:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          }
        },
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          }
        },
        {
          label: 'Удаленная запись',
          key: 'isDeleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'objectives'
          }
        }
      ],
      blocks: [{title: '', key: 'objectives'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE'
    }
  },
  {
    title: 'Социальная категория пациентов',
    type: 'list',
    name: 'patient-social-type',
    method: 'getReferenceTypeListPatientSocialTypeUsingGET',
    block: 'objectives',
    colDef: [
      {
        headerName: 'Код',
        field: 'code',
        width: 150,
      },
      {
        headerName: 'Наименование',
        field: 'name',
        width: 400
      }
    ],
    item: {
      title: 'Социальная категория пациента',
      descriptions: [
        {
          label: 'Тип',
          key: 'type',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          },
          hide: true,
          presetValue: 'PATIENT_SOCIAL_TYPE'
        },
        {
          label: 'Код:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          }
        },
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          }
        },
        {
          label: 'Удаленная запись',
          key: 'isDeleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'objectives'
          }
        }
      ],
      blocks: [{title: '', key: 'objectives'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE'
    }
  },
  {
    title: 'Документы пациентов',
    type: 'list',
    name: 'patient-source-type',
    method: 'getReferenceTypeListPatientSourceTypeUsingGET',
    block: 'objectives',
    colDef: [
      {
        headerName: 'Код',
        field: 'code',
        width: 150,
      },
      {
        headerName: 'Наименование',
        field: 'name',
        width: 400
      }
    ],
    item: {
      title: 'Документы пациента',
      descriptions: [
        {
          label: 'Тип',
          key: 'type',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          },
          hide: true,
          presetValue: 'PATIENT_SOURCE_TYPE'
        },
        {
          label: 'Код:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          }
        },
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          }
        },
        {
          label: 'Удаленная запись',
          key: 'isDeleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'objectives'
          }
        }
      ],
      blocks: [{title: '', key: 'objectives'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE'
    }
  },
  {
    title: 'Место жительство пациетов',
    type: 'list',
    name: 'patient-type',
    method: 'getReferenceTypeListPatientTypeUsingGET',
    block: 'objectives',
    colDef: [
      {
        headerName: 'Код',
        field: 'code',
        width: 150,
      },
      {
        headerName: 'Наименование',
        field: 'name',
        width: 400
      }
    ],
    item: {
      title: 'Место жительство пациета',
      descriptions: [
        {
          label: 'Тип',
          key: 'type',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          },
          hide: true,
          presetValue: 'PATIENT_TYPE'
        },
        {
          label: 'Код:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          }
        },
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          }
        },
        {
          label: 'Удаленная запись',
          key: 'isDeleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'objectives'
          }
        }
      ],
      blocks: [{title: '', key: 'objectives'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE'
    }
  },
  {
    title: 'Зрачки',
    type: 'list',
    name: 'penalties',
    method: 'getReferenceTypeListPenaltiesUsingGET',
    block: 'objectives',
    colDef: [
      {
        headerName: 'Код',
        field: 'code',
        width: 150,
      },
      {
        headerName: 'Наименование',
        field: 'name',
        width: 400
      }
    ],
    item: {
      title: 'Зрачки',
      descriptions: [
        {
          label: 'Тип',
          key: 'type',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          },
          hide: true,
          presetValue: 'PENALTIES'
        },
        {
          label: 'Код:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          }
        },
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          }
        },
        {
          label: 'Удаленная запись',
          key: 'isDeleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'objectives'
          }
        }
      ],
      blocks: [{title: '', key: 'objectives'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE'
    }
  },
  {
    title: 'Зрачки D_S',
    type: 'list',
    name: 'penalties-ds',
    method: 'getReferenceTypeListPenaltiesDSUsingGET',
    block: 'objectives',
    colDef: [
      {
        headerName: 'Код',
        field: 'code',
        width: 150,
      },
      {
        headerName: 'Наименование',
        field: 'name',
        width: 400
      }
    ],
    item: {
      title: 'Зрачки D_S',
      descriptions: [
        {
          label: 'Тип',
          key: 'type',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          },
          hide: true,
          presetValue: 'PENALTIES_D_S'
        },
        {
          label: 'Код:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          }
        },
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          }
        },
        {
          label: 'Удаленная запись',
          key: 'isDeleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'objectives'
          }
        }
      ],
      blocks: [{title: '', key: 'objectives'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE'
    }
  },
  {
    title: 'Рефлексы D_S',
    type: 'list',
    name: 'reflexes-ds',
    method: 'getReferenceTypeListReflexesDSUsingGET',
    block: 'objectives',
    colDef: [
      {
        headerName: 'Код',
        field: 'code',
        width: 150,
      },
      {
        headerName: 'Наименование',
        field: 'name',
        width: 400
      }
    ],
    item: {
      title: 'Рефлекс D_S',
      descriptions: [
        {
          label: 'Тип',
          key: 'type',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          },
          hide: true,
          presetValue: 'REFLEXES_D_S'
        },
        {
          label: 'Код:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          }
        },
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          }
        },
        {
          label: 'Удаленная запись',
          key: 'isDeleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'objectives'
          }
        }
      ],
      blocks: [{title: '', key: 'objectives'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE'
    }
  },
  {
    title: 'Сухожильные рефлексы',
    type: 'list',
    name: 'reflexes-tendon',
    method: 'getReferenceTypeListTendonReflexesUsingGET',
    block: 'objectives',
    colDef: [
      {
        headerName: 'Код',
        field: 'code',
        width: 150,
      },
      {
        headerName: 'Наименование',
        field: 'name',
        width: 400
      }
    ],
    item: {
      title: 'Сухожильный рефлекс',
      descriptions: [
        {
          label: 'Тип',
          key: 'type',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          },
          hide: true,
          presetValue: 'TENDON_REFLEXES'
        },
        {
          label: 'Код:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          }
        },
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          }
        },
        {
          label: 'Удаленная запись',
          key: 'isDeleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'objectives'
          }
        }
      ],
      blocks: [{title: '', key: 'objectives'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE'
    }
  },
  {
    title: 'Результаты',
    type: 'list',
    name: 'result',
    method: 'getReferenceTypeListResultUsingGET',
    block: 'objectives',
    colDef: [
      {
        headerName: 'Код',
        field: 'code',
        width: 150,
      },
      {
        headerName: 'Наименование',
        field: 'name',
        width: 400
      }
    ],
    item: {
      title: 'Результат',
      descriptions: [
        {
          label: 'Тип',
          key: 'type',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          },
          hide: true,
          presetValue: 'RESULT'
        },
        {
          label: 'Код:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          }
        },
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          }
        },
        {
          label: 'Удаленная запись',
          key: 'isDeleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'objectives'
          }
        }
      ],
      blocks: [{title: '', key: 'objectives'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE'
    }
  },
  {
    title: 'Причина результов',
    type: 'list',
    name: 'result-cause',
    method: 'getReferenceTypeListResultCauseUsingGET',
    block: 'objectives',
    colDef: [
      {
        headerName: 'Код',
        field: 'code',
        width: 150,
      },
      {
        headerName: 'Наименование',
        field: 'name',
        width: 400
      }
    ],
    item: {
      title: 'Причина результата',
      descriptions: [
        {
          label: 'Тип',
          key: 'type',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          },
          hide: true,
          presetValue: 'RESULT_CAUSE'
        },
        {
          label: 'Код:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          }
        },
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          }
        },
        {
          label: 'Удаленная запись',
          key: 'isDeleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'objectives'
          }
        }
      ],
      blocks: [{title: '', key: 'objectives'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE'
    }
  },
  {
    title: 'Транспортировки',
    type: 'list',
    name: 'transportation',
    method: 'getReferenceTypeListTransportationUsingGET',
    block: 'objectives',
    colDef: [
      {
        headerName: 'Код',
        field: 'code',
        width: 150,
      },
      {
        headerName: 'Наименование',
        field: 'name',
        width: 400
      }
    ],
    item: {
      title: 'Транспортировка',
      descriptions: [
        {
          label: 'Тип',
          key: 'type',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          },
          hide: true,
          presetValue: 'TRANSPORTATION'
        },
        {
          label: 'Код:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          }
        },
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          }
        },
        {
          label: 'Удаленная запись',
          key: 'isDeleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'objectives'
          }
        }
      ],
      blocks: [{title: '', key: 'objectives'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE'
    }
  },
  {
    title: 'Методы транспортировки',
    type: 'list',
    name: 'transportation-method',
    method: 'getReferenceTypeListTransportationMethodUsingGET',
    block: 'objectives',
    colDef: [
      {
        headerName: 'Код',
        field: 'code',
        width: 150,
      },
      {
        headerName: 'Наименование',
        field: 'name',
        width: 400
      }
    ],
    item: {
      title: 'Метод транспортировки',
      descriptions: [
        {
          label: 'Тип',
          key: 'type',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          },
          hide: true,
          presetValue: 'TRANSPORTATION_METHOD'
        },
        {
          label: 'Код:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          }
        },
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'objectives'
          }
        },
        {
          label: 'Удаленная запись',
          key: 'isDeleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'objectives'
          }
        }
      ],
      blocks: [{title: '', key: 'objectives'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE'
    }
  },
];


export const getListOfDictionaries = (block: string) => {
  return dictionaries.filter(
    d => d.block === block
  );
};

export const getDictInfo = (name: string) => {
  return {...dictionaries.find(el => el.name === name)};
};
