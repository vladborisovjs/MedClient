import {ISimpleDescription} from '../../shared/simple-control/services/simple-description.service';
import {ColDef} from 'ag-grid-community';

export interface IDictItem {
  title: string,
  method: string, // метод получения элемента справочника
  saveMethod: string, // метод сохранения элемента справочника
  createMethod?: string, // метод сохранения элемента справочника
  blocks?: {title: string, key: string}[], // список блоков полей (для разных descriptions: ISimpleDescription[])
  descriptions: ISimpleDescription[]
}

export interface IDictionaryInfo {
  title: string // Наименование справочника
  type: string// list, tree
  method: string, // method api
  name: string, // имя для роутера
  colDef?: ColDef[]
  block: string,
  item: IDictItem,
  params?: any, // параметры запроса
  paramsOrder?: string[], // порядок параметров
}

const dictionaries: IDictionaryInfo[] = [
  {
    title: 'Подразделения',
    name: 'subdivisions',
    type: 'tree',
    method: 'readTreeUsingGET_1',
    block: 'common',
    item: {
      title: 'Подразделение',
      descriptions: [
        {
          label: 'Тип',
          key: 'type_id',
          type: 'dict',
          dict: 'readAllUsingGET_39',
          shortDict: true,
          bindLabel: 'name',
          bindValue: 'id',
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
          shortDict: true,
          dict: 'readAllUsingGET_10',
          dictFiltersOrder: ['type'],
          additional: {
            block: 'address'
          }
        },
        {
          label: 'Населенный пункт',
          key: '',
          type: 'dict',
          shortDict: true,
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
          shortDict: true,
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
          shortDict: true,
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
          type: 'text',
          additional: {
            block: 'contactInfo'
          }
        },
        {
          label: 'E-mail',
          key: 'email',
          type: 'text',
          additional: {
            block: 'contactInfo'
          }
        },
      ],
      blocks: [
        {title: 'Общие сведения', key: 'general'},
        {title: 'Адрес', key: 'address'},
        {title: 'Контактные данные', key: 'contactInfo'},
      ],
      method: 'readOneUsingGET_36',
      saveMethod: 'updateUsingPUT_30',
      createMethod: 'createUsingPOST_29'
    }
  },
  {
    title: 'Больницы',
    type: 'list',
    name: 'hospitals',
    method: 'readAllUsingGET_15',
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
          shortDict: true,
          dict: 'readAllUsingGET_10',
          dictFiltersOrder: ['type'],
          additional: {
            block: 'address'
          }
        },
        {
          label: 'Улица',
          key: '',
          type: 'dict',
          shortDict: true,
          dict: '',
          dictFiltersOrder: ['type'],
          additional: {
            block: 'address'
          }
        },
        {
          label: 'Телефон',
          key: 'phone',
          type: 'text',
          additional: {
            block: 'contactInfo'
          }
        },
        {
          label: 'E-mail',
          key: 'email',
          type: 'text',
          additional: {
            block: 'contactInfo'
          }
        },
        {
          label: 'Удаленная запись',
          key: 'deleted',
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
      method: 'readOneUsingGET_15',
      saveMethod: 'updateUsingPUT_13',
      createMethod: 'createUsingPOST_11',

    }
  },
  {
    title: 'Типы графиков',
    type: 'list',
    name: 'schedule-types',
    method: 'readAllScheduleTypeUsingGET',
    block: 'common',
    paramsOrder: ['subId'],
    colDef: [
      {
        headerName: 'Наименование',
        field: 'name',
        width: 135,
      },
      {
        headerName: 'Начало',
        field: 'time_from',
        width: 135,
      },
      {
        headerName: 'Длительность',
        field: 'time_working',
        width: 145,
      },
      {
        headerName: 'Рабочих дней',
        field: 'days_working',
        width: 135,
      },
      {
        headerName: 'Выходных дней',
        field: 'days_off',
        width: 145,
      },
    ],
    item: {
      title: 'График',
      descriptions: [
        {
          label: 'Наименование',
          key: 'name',
          type: 'text',
          additional: {
            block: 'common'
          }
        },
        {
          label: 'Рабочих дней',
          key: 'days_working',
          type: 'number',
          additional: {
            block: 'common'
          }
        },        {
          label: 'Выходных дней',
          key: 'days_off',
          type: 'number',
          additional: {
            block: 'common'
          }
        },        {
          label: 'Начало рабочего дня',
          key: 'time_from',
          type: 'text',
          additional: {
            block: 'common'
          }
        },        {
          label: 'Рабочих часов',
          key: 'time_working',
          type: 'text',
          additional: {
            block: 'common'
          }
        },
        {
          label: 'Удаленная запись',
          key: 'is_deleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'common'
          }
        }
      ],
      blocks: [{title: '', key: 'common'}],
      method: 'readScheduleTypeUsingGET',
      saveMethod: 'updateScheduleTypeUsingPUT',
      createMethod: 'createScheduleTypeUsingPOST'
    }
  },
  {
    title: 'Транспорт',
    type: 'list',
    name: 'transport',
    method: 'readAllUsingGET_44',
    block: 'common',
    colDef: [
      {
        headerName: 'Гос. номер',
        field: 'state_mark',
        width: 150,
      },
      {
        headerName: 'Марка',
        field: 'brand',
        width: 200
      },
      {
        headerName: 'Цвет',
        field: 'color',
        width: 200
      },
    ],
    item: {
      title: 'Транспортное средство',
      descriptions: [
        {
          label: 'Гос. номер:',
          key: 'state_mark',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'common'
          }
        },
        {
          label: 'Марка:',
          key: 'brand',
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
        {
          label: 'Удаленная запись',
          key: 'deleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'common'
          }
        }
      ],
      blocks: [
        {title: '', key: 'common'},
      ],
      method: 'readOneUsingGET_42',
      saveMethod: 'updateUsingPUT_36',
      createMethod: 'createUsingPOST_35'
    }
  },
  {
    title: 'Должности',
    type: 'list',
    name: 'performer-types',
    method: 'readAllUsingGET_21',
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
        {
          label: 'Удаленная запись',
          key: 'deleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'common'
          }
        }
      ],
      blocks: [{title: '', key: 'common'}],
      method: 'readOneUsingGET_20',
      saveMethod: 'updateUsingPUT_17',
      createMethod: 'createUsingPOST_15'
    }
  },
  {
    title: 'Специализации',
    type: 'list',
    name: 'skills',
    method: 'readAllUsingGET_36',
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
        {
          label: 'Удаленная запись',
          key: 'deleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'common'
          }
        }
      ],
      blocks: [{title: '', key: 'common'}],
      method: 'readOneUsingGET_35',
      saveMethod: 'updateUsingPUT_29',
      createMethod: 'createUsingPOST_28'
    }
  },
  {
    title: 'Типы бригад',
    type: 'list',
    name: 'brigades-types',
    method: 'readAllUsingGET_5',
    block: 'types',
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
            block: 'types'
          }
        },
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'types'
          }
        },
        {
          label: 'Удаленная запись',
          key: 'deleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'types'
          }
        }
      ],
      blocks: [{title: '', key: 'types'}],
      method: 'readOneUsingGET_4',
      saveMethod: 'updateUsingPUT_4',
      createMethod: 'createUsingPOST_4'
    }
  },
  {
    title: 'Типы передачи',
    type: 'list',
    name: 'brigade-receiving',
    method: 'readAllUsingGET_34',
    block: 'types',
    params: {type: 'BRIGADE_RECEIVING'},
    paramsOrder: ['type'],
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
          label: 'Код:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'types'
          }
        },
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'types'
          }
        },
        {
          label: 'Удаленная запись',
          key: 'deleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'types'
          }
        }
      ],
      blocks: [{title: '', key: 'types'}],
      method: 'readOneUsingGET_33',
      saveMethod: 'updateUsingPUT_28',
      createMethod: 'createUsingPOST_26'
    }
  },
  {
    title: 'Типы заявителей',
    type: 'list',
    name: 'declarant-types',
    method: 'readAllUsingGET_34',
    block: 'types',
    params: {type: 'DECLARANT'},
    paramsOrder: ['type'],
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
          label: 'Код:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'types'
          }
        },
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'types'
          }
        },
        {
          label: 'Удаленная запись',
          key: 'deleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'types'
          }
        }
      ],
      blocks: [{title: '', key: 'types'}],
      method: 'readOneUsingGET_33',
      saveMethod: 'updateUsingPUT_28',
      createMethod: 'createUsingPOST_26'
    }
  },
  {
    title: 'Виды состояний пациентов',
    type: 'list',
    name: 'general-state',
    method: 'readAllUsingGET_34',
    block: 'types',
    params: {type: 'GENERAL_STATE'},
    paramsOrder: ['type'],
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
          label: 'Код:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'types'
          }
        },
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'types'
          }
        },
        {
          label: 'Удаленная запись',
          key: 'deleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'types'
          }
        }
      ],
      blocks: [{title: '', key: 'types'}],
      method: 'readOneUsingGET_33',
      saveMethod: 'updateUsingPUT_28',
      createMethod: 'createUsingPOST_26'
    }
  },
  {
    title: 'Типы вызовов',
    type: 'list',
    name: 'call-types',
    method: 'readAllUsingGET_34',
    block: 'calls',
    params: {type: 'CALL'},
    paramsOrder: ['type'],
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
          key: 'deleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'calls'
          }
        }
      ],
      blocks: [{title: '', key: 'calls'}],
      method: 'readOneUsingGET_33',
      saveMethod: 'updateUsingPUT_28',
      createMethod: 'createUsingPOST_26'
    }
  },
  {
    title: 'Места вызовова',
    type: 'list',
    name: 'place-types',
    method: 'readAllUsingGET_34',
    block: 'calls',
    params: {type: 'CALL_PLACE'},
    paramsOrder: ['type'],
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
      title: 'Место вызова',
      descriptions: [
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
          key: 'deleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'calls'
          }
        }
      ],
      blocks: [{title: '', key: 'calls'}],
      method: 'readOneUsingGET_33',
      saveMethod: 'updateUsingPUT_28',
      createMethod: 'createUsingPOST_26'
    }
  },
  {
    title: 'Опросник "Повод к вызову"',
    type: 'tree',
    name: 'inquirer',
    method: 'readTreeUsingGET',
    block: 'calls',
    item: {
      title: 'Опросник "Повод к вызову',
      descriptions: [
        {
          label: 'Код:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'inquirer'
          }
        },
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'inquirer'
          }
        },
        {
          label: 'Удаленная запись',
          key: 'deleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'inquirer'
          }
        }
      ],
      blocks: [{title: '', key: 'inquirer'}],
      method: 'readObjectUsingGET',
      saveMethod: 'updateObjectUsingPUT',
      createMethod: 'updateObjectUsingPOST'
    }
  },
  {
    title: 'Единицы измерения',
    type: 'list',
    name: 'units',
    method: 'readAllUsingGET_46',
    block: 'drugs',
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
            block: 'drugs'
          }
        },
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'drugs'
          }
        },
        {
          label: 'Удаленная запись',
          key: 'deleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'drugs'
          }
        }
      ],
      blocks: [{title: '', key: 'drugs'}],
      method: 'readOneUsingGET_44',
      saveMethod: 'updateUsingPUT_38',
      createMethod: 'createUsingPOST_37'
    }
  },

  {
    title: 'Управление бригадами',
    type: 'list',
    name: 'brigades-control',
    method: 'readAllUsingGET_4',
    block: 'common',
    params: {deleted: false},
    paramsOrder: ['deleted','subId'],
    colDef: [
      {
        headerName: 'Наименование',
        field: 'full_name',
        width: 270,
      },
      {
        headerName: 'Специализация',
        field: 'br_type_name',
        width: 200,
      },
      {
        headerName: 'Место работы',
        field: 'workplace_name',
        width: 300,
      },
    ],
    item: {
      title: 'Бригада',
      descriptions: [
        {
          label: 'Наименование',
          key: 'full_name',
          type: 'text',
          additional: {
            block: 'common'
          }
        },
        {
          label: 'Тип',
          key: 'br_type_id',
          type: 'dict',
          dict: 'readAllUsingGET_5',
          shortDict: true,
          bindLabel: 'name',
          bindValue: 'id',
          additional: {
            block: 'common'
          }
        },
        {
          label: 'Удаленная запись',
          key: 'is_deleted',
          type: 'checkbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'common'
          }
        }
      ],
      blocks: [{title: '', key: 'common'}],
      method: 'readOneUsingGET_3',
      saveMethod: 'updateUsingPUT_3',
      createMethod: 'createUsingPOST_3'
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

