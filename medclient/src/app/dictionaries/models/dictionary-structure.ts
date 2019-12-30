import {ISimpleDescription} from '../../shared/simple-control/services/simple-description.service';
import {ColDef} from 'ag-grid-community';
import {IConditions} from '../../shared/services/check-condition.service';
import {BrigadeBean, DrugNewBean, InquirerBean, RecordType, SubdivisionBean} from '../../../../swagger/med-api.service';

export interface IDictItem {
  title: string;
  method: string; // метод получения элемента справочника
  fullListMethod?: string; // метод для получения полного списка
  saveMethod: string; // метод сохранения элемента справочника
  restoreMethod?: string; // метод восстановления удаленного элемента справочника
  deleteMethod?: string; // метод восстановления удаления элемента справочника
  blocks?: { title: string, key: string }[]; // список блоков полей (для разных descriptions: ISimpleDescription[])
  conditions?: IConditions; // условия для сравнения разных полей и валидации их
  descriptions: ISimpleDescription[];
  location?: boolean; // если у объекта устанавливается местоположение (активирует карту)
  bean?: any; // тип бина айтема, для приведения типа при сохранении
  recordType?: RecordType; // тип логов записи
  editInSubdivision?: boolean; // Справочник можно редактировать админу района
}

export interface IHeadersTreeTable {
  header: string;
  width: string;
}

export interface IDictionaryInfo {
  title: string; // Наименование справочника
  type: string; // list, tree
  headers?: IHeadersTreeTable[];
  method: string; // method api
  name: string; // имя для роутера
  colDef?: ColDef[];
  block: string;
  item: IDictItem; // элемент справочника
  params?: any; // параметры запроса
  paramsOrder?: string[]; // порядок параметров
  filters?: ISimpleDescription[]; // фильтры справочника
  rootLevel?: number; // поле значения корневого узла в tree dict
  editInSubdivision?: boolean; // Справочник можно редактировать админу района
  readOnly?: boolean; // только чтение true /чтение + редактирование  false
}

const dictionaries: IDictionaryInfo[] = [
  {
    title: 'Активные посещения',
    type: 'list',
    name: 'active-visit',
    method: 'getReferenceTypeListActiveVisitUsingGET',
    block: 'common',
    paramsOrder: ['name', 'code'],
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
    filters: [
      {
        label: 'Наименование:',
        key: 'name',
        type: 'text',
        styleClass: 'col-2',
      },
      {
        label: 'Код:',
        key: 'code',
        type: 'text',
        styleClass: 'col-1',
      },
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
      deleteMethod: 'deleteReferenceTypeUsingDELETE',
      recordType: RecordType.REFERENCE_TYPE
    }
  },
  {
    title: 'Отделения и посты СМП',
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
          label: 'Краткое наименование подразделения:',
          key: 'shortName',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'general'
          }
        },
        {
          label: 'Район',
          key: 'district',
          type: 'text',
          additional: {
            block: 'address'
          }
        },
        {
          label: 'Населенный пункт',
          key: 'settlement',
          type: 'text',
          styleClass: 'col-4',
          additional: {
            block: 'address'
          }
        },
        {
          label: 'Улица',
          key: 'street',
          type: 'text',
          styleClass: 'col-4',
          additional: {
            block: 'address'
          }
        },
        {
          label: 'Дом',
          key: 'houseNumber',
          type: 'text',
          styleClass: 'col-4',
          additional: {
            block: 'address'
          }
        },
        // {
        //   label: 'Корпус',
        //   key: 'building',
        //   type: 'text',
        //   styleClass: 'col-4',
        //   additional: {
        //     block: 'address'
        //   }
        // },
        // {
        //   label: 'Лит./Стр',
        //   key: 'structure',
        //   type: 'text',
        //   styleClass: 'col-4',
        //   additional: {
        //     block: 'address'
        //   }
        // },
        {
          label: 'Телефон',
          key: 'phone',
          type: 'mask',
          additional: {
            block: 'contactInfo'
          }
        },
        {
          label: 'E-mail',
          key: 'email',
          errorText: 'Неверный формат почты',
          pattern: '^(\\w+[\\w-\\.]*\\@\\w+((-\\w+)|(\\w*))\\.[a-z]{2,3}|\s*)$',
          type: 'text',
          additional: {
            block: 'contactInfo'
          }
        },
      ],
      location: true,
      blocks: [
        {title: 'Общие сведения', key: 'general'},
        {title: 'Адрес', key: 'address'},
        {title: 'Контактные данные', key: 'contactInfo'},
      ],
      method: 'getSubdivisionUsingGET',
      saveMethod: 'updateSubdivisionUsingPOST',
      restoreMethod: 'restoreSubdivisionUsingPOST',
      deleteMethod: 'deleteSubdivisionUsingDELETE',
      bean: SubdivisionBean,
      recordType: RecordType.SUBDIVISION
    }
  },
  {
    title: 'Медицинские организации',
    type: 'list',
    name: 'hospitals',
    method: 'getSubdivisionListUsingGET',
    params: {type: [1558]},
    paramsOrder: ['type'],
    block: 'common',
    colDef: [
      {
        headerName: 'Код организации',
        field: 'code',
        width: 100,
      },
      {
        headerName: 'Наименование организации',
        field: 'name',
        width: 400
      },
      {
        headerName: 'Краткое наименование организации',
        field: 'shortName',
        width: 100
      },
      {
        headerName: 'Электронная почта',
        field: 'email',
        width: 100
      },
      {
        headerName: 'Веб сайт',
        field: 'website',
        width: 100
      },
      {
        headerName: 'Телефон',
        field: 'phone',
        width: 100
      },
      {
        headerName: 'Полный адрес',
        field: '',
        width: 100
      },
      {
        headerName: 'Наименование района',
        field: '',
        width: 100
      },
      {
        headerName: 'Населенный пункт',
        field: '',
        width: 100
      },
      {
        headerName: 'Улица',
        field: '',
        width: 100
      },
      {
        headerName: 'Номер дома',
        field: '',
        width: 100
      },
    ],
    item: {
      title: 'Медицинская организация',
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
          label: 'Код  организации:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'general'
          }
        },
        {
          label: 'Наименование  организации:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'general'
          }
        },
        {
          label: 'Краткое наименование  организации:',
          key: 'shortName',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'general'
          }
        },
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
          type: 'mask',
          additional: {
            block: 'contactInfo'
          }
        },
        {
          label: 'E-mail',
          key: 'email',
          errorText: 'Неверный формат почты',
          pattern: '^(\\w+[\\w-\\.]*\\@\\w+((-\\w+)|(\\w*))\\.[a-z]{2,3}|\s*)$',
          type: 'text',
          additional: {
            block: 'contactInfo'
          }
        },
        {
          label: 'Web-сайт',
          key: 'website',
          // errorText: 'Неверный формат сайта',
          // pattern: '^((https?:\\/\\/)?(www\\.)?([a-zA-Z0-9]+(-?[a-zA-Z0-9])*\\.)+[\\w]{2,}(\\/\\S*)?|\s*)$',
          type: 'text',
          additional: {
            block: 'contactInfo'
          }
        },
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
    title: 'Виды организаций',
    type: 'list',
    name: 'hospitals-types',
    method: 'getSubdivisionTypeListUsingGET',
    block: 'common',
    paramsOrder: ['name', 'code'],
    colDef: [
      {
        headerName: 'Наименование',
        field: 'name',
        width: 200
      },
      {
        headerName: 'Код вида подразделения',
        field: 'code',
        width: 100
      },
      {
        headerName: 'Код подразделения, которому подчиняется',
        field: 'parentId',
        width: 100
      },
    ],
    filters: [
      {
        label: 'Наименование:',
        key: 'name',
        type: 'text',
        styleClass: 'col-2',
      },
      {
        label: 'Код:',
        key: 'code',
        type: 'text',
        styleClass: 'col-1',
      },
    ],
    item: {
      title: 'Вид организации',
      descriptions: [
        {
          label: 'Вид подразделения:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'general'
          }
        },
        {
          label: 'Код вида подразделения:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'general'
          }
        },
      ],

      blocks: [
        {title: 'Общие сведения', key: 'general'},
      ],
      method: 'getSubdivisionTypeUsingGET',
      saveMethod: 'updateSubdivisionTypeUsingPOST',
      restoreMethod: 'restoreSubdivisionTypeUsingPOST',
      deleteMethod: 'deleteSubdivisionTypeUsingDELETE'
    }
  },
  {
    title: 'Графики работы сотрудников',
    type: 'list',
    name: 'schedule-types',
    method: 'getScheduleTypeListUsingGET',
    block: 'common',
    paramsOrder: ['name', 'code'],
    colDef: [
      {
        headerName: 'Наименование графика работы',
        field: 'name',
        width: 135,
      },
      {
        headerName: 'Количество рабочих минут в одном рабочем дне',
        field: 'workingMinutes',
        width: 145,
      },
      {
        headerName: 'Количество рабочих дней в одном цикле графика',
        field: 'workingDays',
        width: 135,
      },
      {
        headerName: 'Время начала работы по графику',
        field: 'timeFrom',
        width: 135,
      },
      {
        headerName: 'Количество выходных дней в одном цикле графика',
        field: 'daysOff',
        width: 145,
      },
    ],
    filters: [
      {
        label: 'Наименование:',
        key: 'name',
        type: 'text',
        styleClass: 'col-2',
      },
      // {
      //   label: 'Код:',
      //   key: 'code',
      //   type: 'text',
      //   styleClass: 'col-1',
      // },
    ],
    item: {
      title: 'График работы сотрудников',
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
        },
        makeWorkCode: {
          true: true
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
          label: 'Рабочих минут',
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
    title: 'Автотранспорт',
    type: 'list',
    name: 'transport',
    method: 'getTransportListUsingGET',
    block: 'common',
    params: {isHelicopter: false},
    paramsOrder: ['name', 'code', 'isHelicopter', 'subdivision'],
    colDef: [
      {
        headerName: 'Подразделение, которому принадлежит',
        field: 'subdivisionFK.shortName', //
        width: 150
      },
      {
        headerName: 'Регистрационный номер',
        field: 'code',
        width: 150,
      },
      {
        headerName: 'Тип',
        field: 'name',
        width: 200
      },
      {
        headerName: 'Признак',
        cellRenderer: p => {
          if (p.data && p.data.isHelicopter) {
            return 'авиация';
          } else {
            return 'авто';
          }
        },
        width: 100
      }
    ],
    filters: [
      {
        label: 'Тип:',
        key: 'name',
        type: 'text',
        styleClass: 'col-1',
      },
      {
        label: 'Регистрационный номер:',
        key: 'code',
        type: 'text',
        styleClass: 'col-2',
      },
      {
        label: 'Район',
        key: 'subdivision',
        type: 'dict',
        dict: 'getDistrictListUsingGET',
        bindLabel: 'shortName',
        bindValue: 'id',
        shortDict: true,
        dictFilters: {rootId: [1]},
        dictFiltersOrder: ['rootId'],
        styleClass: 'col-4',
        additional: {
          block: 'general'
        }
      },
    ],
    item: {
      title: 'Автотранспорт',
      descriptions: [
        {
          label: 'Район:',
          key: 'subdivisionFK',
          type: 'dict',
          dict: 'getSubdivisionListUsingGET',
          bindLabel: 'shortName',
          dictFilters: {type: [448641, 1202]},
          dictFiltersOrder: ['type'],
          required: true,
          styleClass: 'col-12',
          additional: {
            block: 'common'
          }
        },
        {
          label: 'Регистрационный номер:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'common'
          }
        },
        {
          label: 'Марка',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'common'
          }
        },
        {
          label: 'VIN',
          key: 'vin',
          type: 'text',
          styleClass: 'col-6',
          additional: {
            block: 'common'
          }
        },
        {
          label: 'Год выпуска',
          key: 'manufactureYear',
          type: 'number',
          styleClass: 'col-6',
          additional: {
            block: 'common'
          }
        },
        {
          label: 'Авто',
          key: 'isHelicopter',
          type: 'checkbox',
          styleClass: '',
          additional: {
            block: 'common'
          },
          hide: true,
          presetValue: 'false'
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
    title: 'Виды автотранспорта',
    type: 'list',
    name: 'transport-types',
    method: 'getTransportTypeUsingGET',
    block: 'common',
    colDef: [
      {
        headerName: 'Наименование',
        field: 'type',
        width: 150
      },
    ],
    item: {
      title: 'Вид автотранспорта',
      descriptions: [
        {
          label: 'Наименование:',
          key: 'type',
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
      method: '',
      saveMethod: '',
      restoreMethod: '',
      deleteMethod: ''
    }
  },
  {
    title: 'Санитарная авиация',
    type: 'list',
    name: 'helicopters',
    method: 'getTransportListUsingGET',
    block: 'common',
    params: {isHelicopter: true},
    paramsOrder: ['name', 'code', 'isHelicopter'],
    colDef: [
      {
        headerName: 'Подразделение, которому принадлежит',
        field: 'subdivision',
        width: 150
      },
      {
        headerName: 'Регистрационный номер',
        field: 'code',
        width: 150,
      },
      {
        headerName: 'Тип',
        field: 'name',
        width: 200
      },
      {
        headerName: 'Признак',
        cellRenderer: p => {
          if (p.data && p.data.isHelicopter) {
            return 'авиация';
          } else {
            return 'авто';
          }
        },
        width: 100
      }
    ],
    filters: [
      {
        label: 'Тип:',
        key: 'name',
        type: 'text',
        styleClass: 'col-1',
      },
      {
        label: 'Регистрационный номер:',
        key: 'code',
        type: 'text',
        styleClass: 'col-2',
      },
    ],
    item: {
      title: 'Санитарная авиация',
      descriptions: [
        {
          label: 'Подразделение:',
          key: 'subdivision',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'common'
          }
        },
        {
          label: 'Регистрационный номер:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'common'
          }
        },
        {
          label: 'Тип:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'common'
          }
        },
        {
          label: 'Авиационный транспорт',
          key: 'isHelicopter',
          type: 'checkbox',
          styleClass: '',
          additional: {
            block: 'common'
          }
        },
        {
          label: 'Доступен',
          key: 'isAvailable',
          type: 'checkbox',
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
    title: 'Должности сотрудников',
    type: 'list',
    name: 'performer-types',
    method: 'getPerformerTypeListUsingGET',
    block: 'common',
    paramsOrder: ['name', 'code'],
    colDef: [
      {
        headerName: 'Должность',
        field: 'name',
        width: 200
      },
      {
        headerName: 'Код',
        field: 'code',
        width: 100,
      },
      {
        headerName: 'Краткое наименование',
        field: 'shortName',
        width: 100
      },
      {
        headerName: 'Группа',
        field: 'groupName',
        width: 150,
      },
    ],
    filters: [
      {
        label: 'Наименование:',
        key: 'name',
        type: 'text',
        styleClass: 'col-2',
      },
      {
        label: 'Код:',
        key: 'code',
        type: 'text',
        styleClass: 'col-1',
      },
    ],
    item: {
      title: 'Должность сотрудника',
      descriptions: [
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
          label: 'Код:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'common'
          }
        },
        {
          label: 'Краткое ниаменование:',
          key: 'shortName',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'common'
          }
        },
        {
          label: 'Группа',
          key: 'groupCode',
          type: 'select',
          selectList: [
            {name: 'Мед. работник бригад', id: 0},
            {name: 'Водители бригад', id: 1},
            {name: 'Невыездной персонал', id: 2},
            {name: 'Пилоты авиабригад', id: 3},
            {name: 'Мед. работники авиабригад', id: 4},
            {name: 'Прочий персонал бригад', id: 5},
          ],
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
    title: 'Специализации сотрудников',
    type: 'list',
    name: 'skills',
    method: 'getSkillListUsingGET',
    block: 'common',
    paramsOrder: ['name', 'code'],
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
      },
      {
        headerName: 'Общеупотребимое наименование',
        field: 'commonName',
        width: 400
      }
    ],
    filters: [
      {
        label: 'Наименование:',
        key: 'name',
        type: 'text',
        styleClass: 'col-2',
      },
      {
        label: 'Код:',
        key: 'code',
        type: 'text',
        styleClass: 'col-1',
      },
    ],
    item: {
      title: 'Специализация сотрудника',
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
          label: 'Общеупотребимое наименование:',
          key: 'commonName',
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
    title: 'Типы бригад СМП',
    type: 'list',
    name: 'brigades-types',
    method: 'readBrigadeTypeListUsingGET',
    block: 'brigades',
    paramsOrder: ['name', 'code'],
    colDef: [
      {
        headerName: 'Наименование',
        field: 'name',
        width: 400
      },
      {
        headerName: 'Код',
        field: 'code',
        width: 150,
      },
      {
        headerName: 'Признак наличия',
        field: '',
        width: 150,
      },
      {
        headerName: 'Системный код',
        field: '',
        width: 150,
      },
    ],
    filters: [
      {
        label: 'Наименование:',
        key: 'name',
        type: 'text',
        styleClass: 'col-2',
      },
      {
        label: 'Код:',
        key: 'code',
        type: 'text',
        styleClass: 'col-1',
      },
    ],
    item: {
      title: 'Тип бригады СМП',
      descriptions: [
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
          label: 'Код:',
          key: 'code',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'brigades'
          }
        },
      ],

      blocks: [{title: '', key: 'brigades'}],
      method: 'getBrigadeTypeUsingGET',
      saveMethod: 'updateBrigadeTypeUsingPOST',
      restoreMethod: 'restoreBrigadeTypeUsingPOST',
      deleteMethod: 'deleteBrigadeTypeUsingDELETE',
      recordType: RecordType.BRIGADE_TYPE
    }
  },
  {
    title: 'Способы передачи вызовов СМП',
    type: 'list',
    name: 'brigade-receiving',
    method: 'getReferenceTypeListReceivingTypeUsingGET',
    block: 'calls',
    paramsOrder: ['name', 'code'],
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
    filters: [
      {
        label: 'Наименование:',
        key: 'name',
        type: 'text',
        styleClass: 'col-2',
      },
      {
        label: 'Код:',
        key: 'code',
        type: 'text',
        styleClass: 'col-1',
      },
    ],
    item: {
      title: 'Способ передачи вызова СМП',
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
        // {
        //   label: 'Удаленная запись',
        //   key: 'isDeleted',
        //   type: 'checkbox',
        //   styleClass: 'inline-checkbox col-12',
        //   additional: {
        //     block: 'brigades'
        //   }
        // }
      ],

      blocks: [{title: '', key: 'brigades'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE',
      recordType: RecordType.REFERENCE_TYPE
    }
  },
  {
    title: 'Состояния вызовов СМП',
    type: 'list',
    name: 'call-statuses',
    method: 'getCallStatusListUsingGET',
    block: 'calls',
    colDef: [
      {
        headerName: 'Наименование',
        field: 'name',
        width: 400
      }
    ],
    filters: [
      {
        label: 'Наименование:',
        key: 'name',
        type: 'text',
        styleClass: 'col-2',
      },
    ],
    item: {
      title: 'Состояние вызова СМП',
      descriptions: [
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'brigades'
          }
        },
      ],

      blocks: [{title: '', key: 'brigades'}],
      method: '',
      restoreMethod: '',
      saveMethod: '',
      deleteMethod: '',
    }
  },
  {
    title: 'Место вызова бригад',
    type: 'list',
    name: 'brigade-receiving-place',
    method: 'getReferenceTypeListBrigadeReceivingPlaceUsingGET',
    block: 'brigades',
    paramsOrder: ['name', 'code'],
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
    filters: [
      {
        label: 'Наименование:',
        key: 'name',
        type: 'text',
        styleClass: 'col-2',
      },
      {
        label: 'Код:',
        key: 'code',
        type: 'text',
        styleClass: 'col-1',
      },
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
        // {
        //   label: 'Удаленная запись',
        //   key: 'isDeleted',
        //   type: 'checkbox',
        //   styleClass: 'inline-checkbox col-12',
        //   additional: {
        //     block: 'brigades'
        //   }
        // }
      ],

      blocks: [{title: '', key: 'brigades'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE',
      recordType: RecordType.REFERENCE_TYPE
    }
  },
  {
    title: 'Причины задержек',
    type: 'list',
    name: 'delay-reason',
    method: 'getReferenceTypeListDelayReasonUsingGET',
    block: 'brigades',
    paramsOrder: ['name', 'code'],
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
    filters: [
      {
        label: 'Наименование:',
        key: 'name',
        type: 'text',
        styleClass: 'col-2',
      },
      {
        label: 'Код:',
        key: 'code',
        type: 'text',
        styleClass: 'col-1',
      },
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
        // {
        //   label: 'Удаленная запись',
        //   key: 'isDeleted',
        //   type: 'checkbox',
        //   styleClass: 'inline-checkbox col-12',
        //   additional: {
        //     block: 'brigades'
        //   }
        // }
      ],

      blocks: [{title: '', key: 'brigades'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE',
      recordType: RecordType.REFERENCE_TYPE
    }
  },
  {
    title: 'Типы заявителей вызовов СМП',
    type: 'list',
    name: 'declarant-types',
    method: 'getReferenceTypeListDeclarantUsingGET',
    block: 'common',
    paramsOrder: ['name', 'code'],
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
    filters: [
      {
        label: 'Наименование:',
        key: 'name',
        type: 'text',
        styleClass: 'col-2',
      },
      {
        label: 'Код:',
        key: 'code',
        type: 'text',
        styleClass: 'col-1',
      },
    ],
    item: {
      title: 'Тип заявителя вызова СМП',
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
        // {
        //   label: 'Удаленная запись',
        //   key: 'isDeleted',
        //   type: 'checkbox',
        //   styleClass: 'inline-checkbox col-12',
        //   additional: {
        //     block: 'general'
        //   }
        // }
      ],
      blocks: [{title: '', key: 'general'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE',
      recordType: RecordType.REFERENCE_TYPE
    }
  },
  {
    title: 'Виды состояний пациентов',
    type: 'list',
    name: 'general-state',
    method: 'getReferenceTypeListGeneralStateUsingGET',
    block: 'common',
    paramsOrder: ['name', 'code'],
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
    filters: [
      {
        label: 'Наименование:',
        key: 'name',
        type: 'text',
        styleClass: 'col-2',
      },
      {
        label: 'Код:',
        key: 'code',
        type: 'text',
        styleClass: 'col-1',
      },
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
        // {
        //   label: 'Удаленная запись',
        //   key: 'isDeleted',
        //   type: 'checkbox',
        //   styleClass: 'inline-checkbox col-12',
        //   additional: {
        //     block: 'general'
        //   }
        // }
      ],
      blocks: [{title: '', key: 'general'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE',
      recordType: RecordType.REFERENCE_TYPE
    }
  },
  {
    title: 'Виды вызовов СМП',
    type: 'list',
    name: 'call-types',
    method: 'getReferenceTypeListRingTypeUsingGET',
    block: 'calls',
    paramsOrder: ['name', 'code'],
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
    filters: [
      {
        label: 'Наименование:',
        key: 'name',
        type: 'text',
        styleClass: 'col-2',
      },
      {
        label: 'Код:',
        key: 'code',
        type: 'text',
        styleClass: 'col-1',
      },
    ],
    item: {
      title: 'Вид вызова СМП',
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
          presetValue: 'CALL_TYPE'
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
        // {
        //   label: 'Удаленная запись',
        //   key: 'isDeleted',
        //   type: 'checkbox',
        //   styleClass: 'inline-checkbox col-12',
        //   additional: {
        //     block: 'calls'
        //   }
        // }
      ],
      blocks: [{title: '', key: 'calls'}],
      method: 'getReferenceTypeUsingGET',
      saveMethod: 'updateReferenceTypeUsingPOST',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE',
      recordType: RecordType.REFERENCE_TYPE
    }
  },
//   {
//     title: 'Типы звонков',
//     type: 'list',
//     name: 'ring-type',
//     method: 'getReferenceTypeListRingTypeUsingGET',
//     block: 'calls',
//    paramsOrder: ['name', 'code'],
//     colDef: [
//       {
//         headerName: 'Код',
//         field: 'code',
//         width: 150,
//       },
//       {
//         headerName: 'Наименование',
//         field: 'name',
//         width: 400
//       }
//     ],
//     filters: [
//       {
//         label: 'Наименование:',
//         key: 'name',
//         type: 'text',
//         styleClass: 'col-2',
//       },
//       {
//         label: 'Код:',
//         key: 'code',
//         type: 'text',
//         styleClass: 'col-1',
//       },
//     ],
//     item: {
//       title: 'Тип звонка',
//       descriptions: [
//         {
//           label: 'Тип',
//           key: 'type',
//           type: 'text',
//           styleClass: '',
//           additional: {
//             block: 'calls'
//           },
//           hide: true,
//           presetValue: 'RING_TYPE'
//         },
//         {
//           label: 'Код:',
//           key: 'code',
//           type: 'text',
//           styleClass: '',
//           additional: {
//             block: 'calls'
//           }
//         },
//         {
//           label: 'Наименование:',
//           key: 'name',
//           type: 'text',
//           bindLabel: 'name',
//           additional: {
//             block: 'calls'
//           }
//         },
//         // {
//         //   label: 'Удаленная запись',
//         //   key: 'isDeleted',
//         //   type: 'checkbox',
//         //   styleClass: 'inline-checkbox col-12',
//         //   additional: {
//         //     block: 'calls'
//         //   }
//         // }
//       ],
//       blocks: [{title: '', key: 'calls'}],
//       method: 'getReferenceTypeUsingGET',
//       saveMethod: 'updateReferenceTypeUsingPOST',
//       restoreMethod: 'restoreReferenceTypeUsingPOST',
//       deleteMethod: 'deleteReferenceTypeUsingDELETE',
//       recordType: RecordType.REFERENCE_TYPE
// }
//   },
  {
    title: 'Места вызовов',
    type: 'list',
    name: 'place-types',
    method: 'getReferenceTypeListCallPlaceUsingGET',
    block: 'calls',
    paramsOrder: ['name', 'code'],
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
    filters: [
      {
        label: 'Наименование:',
        key: 'name',
        type: 'text',
        styleClass: 'col-2',
      },
      {
        label: 'Код:',
        key: 'code',
        type: 'text',
        styleClass: 'col-1',
      },
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
        // {
        //   label: 'Удаленная запись',
        //   key: 'isDeleted',
        //   type: 'checkbox',
        //   styleClass: 'inline-checkbox col-12',
        //   additional: {
        //     block: 'calls'
        //   }
        // }
      ],
      blocks: [{title: '', key: 'calls'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE',
      recordType: RecordType.REFERENCE_TYPE
    }
  },
  {
    title: 'Поводы вызова СМП',
    type: 'tree',
    name: 'inquirer',
    method: 'getBranchNodeUsingGET',
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
      title: 'Повод вызова СМП',
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
          label: 'Специализация',
          key: 'specializationFK',
          type: 'dict',
          dict: 'readBrigadeTypeListUsingGET',
          styleClass: '',
          additional: {
            block: 'reasonInquirer'
          }
        },
        // {
        //   label: 'Удаленная запись',
        //   key: 'isDeleted',
        //   type: 'checkbox',
        //   styleClass: 'inline-checkbox col-12',
        //   additional: {
        //     block: 'inquirer'
        //   }
        // }
      ],
      blocks: [{title: '', key: 'inquirer'}],
      method: 'getInquirerUsingGET',
      saveMethod: 'updateInquirerUsingPOST',
      restoreMethod: 'restoreInquirerUsingPOST',
      deleteMethod: 'deleteInquirerUsingDELETE',
      bean: InquirerBean
    },
    rootLevel: 0,
  },
  {
    title: 'Классификатор МКБ-10',
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
      title: 'Классификатор МКБ-10',
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
      fullListMethod: 'getFullListUsingGET',
      saveMethod: 'updateClassMkbUsingPOST',
      restoreMethod: 'restoreClassMkbUsingPOST',
      deleteMethod: 'deleteClassMkbUsingDELETE'
    },
    filters: [
      {
        label: 'Наименование',
        key: 'name',
        type: 'text',
        styleClass: 'col-2',
      },
      {
        label: 'Код',
        key: 'code',
        type: 'text',
        styleClass: 'col-1',
      }
    ],
    paramsOrder: ['name', 'code'],
    rootLevel: -1,
    readOnly: true
  },
  {
    title: 'Бригады СМП',
    type: 'list',
    name: 'brigades-control',
    method: 'getBrigadeListUsingGET',
    block: 'brigades',
    params: {isAvia: false},
    paramsOrder: ['name', 'code', 'isAvia', 'subdivisionId'],
    colDef: [
      {
        headerName: 'Наименование',
        field: 'name',
        width: 270,
      },
      {
        headerName: 'Код',
        field: 'code',
        width: 270,
      },
      {
        headerName: 'Тип бригады',
        field: 'brigadeTypeFK.name',
        width: 300,
      },
      {
        headerName: 'Подразделение',
        field: 'subdivisionFK.name',
        width: 200
      },
    ],
    filters: [
      {
        label: 'Наименование:',
        key: 'name',
        type: 'text',
        styleClass: 'col-2',
      },
      {
        label: 'Код:',
        key: 'code',
        type: 'text',
        styleClass: 'col-1',
      },
    ],
    editInSubdivision: true,
    item: {
      title: 'Бригада СМП',
      descriptions: [
        {
          label: 'Наименование',
          key: 'name',
          type: 'text',
          required: true,
          additional: {
            block: 'brigades'
          }
        },
        {
          label: 'Код',
          key: 'code',
          type: 'text',
          required: true,
          additional: {
            block: 'brigades'
          }
        },
        {
          label: 'Тип',
          key: 'brigadeTypeFK',
          type: 'dict',
          required: true,
          dict: 'readBrigadeTypeListUsingGET',
          additional: {
            block: 'brigades'
          }
        },
        {
          label: 'Район:',
          key: 'subdivisionFK',
          type: 'dict',
          dict: 'getSubdivisionListUsingGET',
          bindLabel: 'shortName',
          dictFilters: {type: [448641, 1202]},
          dictFiltersOrder: ['type'],
          required: true,
          styleClass: 'col-12',
          additional: {
            block: 'brigades'
          }
        },
        // {
        //   label: 'Подразделение',
        //   key: 'subdivisionFK',
        //   type: 'dict',
        //   dict: 'getSubdivisionListUsingGET',
        //   additional: {
        //     block: 'brigades'
        //   }
        // },
        {
          label: 'Авиабригада',
          key: 'isAviaBrigade',
          type: 'tricheckbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'brigades'
          },
          hide: true,
          presetValue: false
        }
      ],
      blocks: [{title: '', key: 'brigades'}],
      method: 'getBrigadeUsingGET',
      saveMethod: 'updateBrigadeUsingPOST',
      restoreMethod: 'restoreBrigadeUsingPOST',
      deleteMethod: 'deleteBrigadeUsingDELETE',
      bean: BrigadeBean,
      recordType: RecordType.BRIGADE,
      editInSubdivision: true,
    }
  },
  {
    title: 'Авиационные бригады',
    type: 'list',
    name: 'aviation-brigades-control',
    method: 'getBrigadeListUsingGET',
    paramsOrder: ['name', 'code', 'isAvia'],
    params: {isAvia: true},
    block: 'brigades',
    filters: [
      {
        label: 'Наименование:',
        key: 'name',
        type: 'text',
        styleClass: 'col-2',
      },
      {
        label: 'Код:',
        key: 'code',
        type: 'text',
        styleClass: 'col-2',
      },
    ],
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
      title: 'Авиационная бригада',
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
          label: 'Район:',
          key: 'subdivisionFK',
          type: 'dict',
          dict: 'getSubdivisionListUsingGET',
          bindLabel: 'shortName',
          dictFilters: {type: [1202]},
          dictFiltersOrder: ['type'],
          required: true,
          styleClass: 'col-12',
          additional: {
            block: 'brigades'
          }
        },
        // {
        //   label: 'Статус',
        //   key: 'brigadeStatusFK',
        //   type: 'dict',
        //   dict: 'getBrigadeStatusListUsingGET',
        //   additional: {
        //     block: 'brigades'
        //   }
        // },
        {
          label: 'Авиабригада',
          key: 'isAviaBrigade',
          type: 'tricheckbox',
          styleClass: 'inline-checkbox col-12',
          additional: {
            block: 'brigades'
          },
          hide: true,
          presetValue: true
        }
      ],
      blocks: [{title: '', key: 'brigades'}],
      method: 'getBrigadeUsingGET',
      saveMethod: 'updateBrigadeUsingPOST',
      restoreMethod: 'restoreBrigadeUsingPOST',
      deleteMethod: 'deleteBrigadeUsingDELETE',
      bean: BrigadeBean,
      recordType: RecordType.BRIGADE
    }
  },
  {
    title: 'Состояния бригад',
    type: 'list',
    name: 'brigades-statuses',
    method: 'getBrigadeStatusListUsingGET',
    block: 'brigades',
    paramsOrder: ['name', 'code'],
    colDef: [
      {
        headerName: 'Наименование',
        field: 'name',
        width: 270,
      },
      {
        headerName: 'Доступна',
        field: 'isAvailable',
        width: 270,
        valueFormatter: (p) => p.value ? 'Да' : 'Нет'
      },
      {
        headerName: 'Код',
        field: 'code',
        width: 270,
      },
    ],
    filters: [
      {
        label: 'Наименование:',
        key: 'name',
        type: 'text',
        styleClass: 'col-2',
      },
      {
        label: 'Код:',
        key: 'code',
        type: 'text',
        styleClass: 'col-1',
      },
    ],
    item: {
      title: 'Состояние бригады',
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
          label: 'Код',
          key: 'code',
          type: 'text',
          additional: {
            block: 'brigades'
          }
        },
        {
          label: 'Доступна',
          key: 'isAvailable',
          type: 'checkbox',
          additional: {
            block: 'brigades'
          }
        }
      ],
      blocks: [{title: '', key: 'brigades'}],
      method: 'getBrigadeStatusUsingGET',
      saveMethod: 'updateBrigadeStatusUsingPOST',
      restoreMethod: 'restoreBrigadeStatusUsingPOST',
      deleteMethod: 'deleteBrigadeStatusUsingDELETE',
      bean: BrigadeBean,
      recordType: RecordType.BRIGADE_STATUS
    }
  },
  {
    title: 'Поведение пациента',
    type: 'list',
    name: 'behaviour',
    method: 'getReferenceTypeListBehaviourUsingGET',
    block: 'objectives',
    paramsOrder: ['name', 'code'],
    filters: [
      {
        label: 'Наименование:',
        key: 'name',
        type: 'text',
        styleClass: 'col-2',
      },
      {
        label: 'Код:',
        key: 'code',
        type: 'text',
        styleClass: 'col-1',
      },
    ],
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
        // {
        //   label: 'Удаленная запись',
        //   key: 'isDeleted',
        //   type: 'checkbox',
        //   styleClass: 'inline-checkbox col-12',
        //   additional: {
        //     block: 'objectives'
        //   }
        // }
      ],
      blocks: [{title: '', key: 'objectives'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE',
      recordType: RecordType.REFERENCE_TYPE
    }
  },
  {
    title: 'Осложнения',
    type: 'list',
    name: 'complications',
    method: 'getReferenceTypeListComplicationsUsingGET',
    block: 'objectives',
    paramsOrder: ['name', 'code'],
    filters: [
      {
        label: 'Наименование:',
        key: 'name',
        type: 'text',
        styleClass: 'col-2',
      },
      {
        label: 'Код:',
        key: 'code',
        type: 'text',
        styleClass: 'col-1',
      },
    ],
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
        // {
        //   label: 'Удаленная запись',
        //   key: 'isDeleted',
        //   type: 'checkbox',
        //   styleClass: 'inline-checkbox col-12',
        //   additional: {
        //     block: 'objectives'
        //   }
        // }
      ],
      blocks: [{title: '', key: 'objectives'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE',
      recordType: RecordType.REFERENCE_TYPE
    }
  },
  {
    title: 'Помощь при осложнениях',
    type: 'list',
    name: 'complications-help',
    method: 'getReferenceTypeListComplicationsHelpUsingGET',
    block: 'objectives',
    paramsOrder: ['name', 'code'],
    filters: [
      {
        label: 'Наименование:',
        key: 'name',
        type: 'text',
        styleClass: 'col-2',
      },
      {
        label: 'Код:',
        key: 'code',
        type: 'text',
        styleClass: 'col-1',
      },
    ],
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
        // {
        //   label: 'Удаленная запись',
        //   key: 'isDeleted',
        //   type: 'checkbox',
        //   styleClass: 'inline-checkbox col-12',
        //   additional: {
        //     block: 'objectives'
        //   }
        // }
      ],
      blocks: [{title: '', key: 'objectives'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE',
      recordType: RecordType.REFERENCE_TYPE
    }
  },
  {
    title: 'Сознание',
    type: 'list',
    name: 'conscious',
    method: 'getReferenceTypeListConsciousUsingGET',
    block: 'objectives',
    paramsOrder: ['name', 'code'],
    filters: [
      {
        label: 'Наименование:',
        key: 'name',
        type: 'text',
        styleClass: 'col-2',
      },
      {
        label: 'Код:',
        key: 'code',
        type: 'text',
        styleClass: 'col-1',
      },
    ],
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
        // {
        //   label: 'Удаленная запись',
        //   key: 'isDeleted',
        //   type: 'checkbox',
        //   styleClass: 'inline-checkbox col-12',
        //   additional: {
        //     block: 'objectives'
        //   }
        // }
      ],
      blocks: [{title: '', key: 'objectives'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE',
      recordType: RecordType.REFERENCE_TYPE
    }
  },
  {
    title: 'Место смерти',
    type: 'list',
    name: 'death',
    method: 'getReferenceTypeListDeathUsingGET',
    block: 'objectives',
    paramsOrder: ['name', 'code'],
    filters: [
      {
        label: 'Наименование:',
        key: 'name',
        type: 'text',
        styleClass: 'col-2',
      },
      {
        label: 'Код:',
        key: 'code',
        type: 'text',
        styleClass: 'col-1',
      },
    ],
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
        // {
        //   label: 'Удаленная запись',
        //   key: 'isDeleted',
        //   type: 'checkbox',
        //   styleClass: 'inline-checkbox col-12',
        //   additional: {
        //     block: 'objectives'
        //   }
        // }
      ],
      blocks: [{title: '', key: 'objectives'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE',
      recordType: RecordType.REFERENCE_TYPE
    }
  },
  {
    title: 'Одышка',
    type: 'list',
    name: 'dyspnea',
    method: 'getReferenceTypeListDyspneaUsingGET',
    block: 'objectives',
    paramsOrder: ['name', 'code'],
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
        // {
        //   label: 'Удаленная запись',
        //   key: 'isDeleted',
        //   type: 'checkbox',
        //   styleClass: 'inline-checkbox col-12',
        //   additional: {
        //     block: 'objectives'
        //   }
        // }
      ],
      blocks: [{title: '', key: 'objectives'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE',
      recordType: RecordType.REFERENCE_TYPE
    }
  },
  {
    title: 'Сердечные шумы',
    type: 'list',
    name: 'heart-noise',
    method: 'getReferenceTypeListHeartNoiseUsingGET',
    block: 'objectives',
    paramsOrder: ['name', 'code'],
    filters: [
      {
        label: 'Наименование:',
        key: 'name',
        type: 'text',
        styleClass: 'col-2',
      },
      {
        label: 'Код:',
        key: 'code',
        type: 'text',
        styleClass: 'col-1',
      },
    ],
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
        // {
        //   label: 'Удаленная запись',
        //   key: 'isDeleted',
        //   type: 'checkbox',
        //   styleClass: 'inline-checkbox col-12',
        //   additional: {
        //     block: 'objectives'
        //   }
        // }
      ],
      blocks: [{title: '', key: 'objectives'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE',
      recordType: RecordType.REFERENCE_TYPE
    }
  },
  {
    title: 'Пульс',
    type: 'list',
    name: 'heart-rate',
    method: 'getReferenceTypeListHeartRateUsingGET',
    block: 'objectives',
    paramsOrder: ['name', 'code'],
    filters: [
      {
        label: 'Наименование:',
        key: 'name',
        type: 'text',
        styleClass: 'col-2',
      },
      {
        label: 'Код:',
        key: 'code',
        type: 'text',
        styleClass: 'col-1',
      },
    ],
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
        // {
        //   label: 'Удаленная запись',
        //   key: 'isDeleted',
        //   type: 'checkbox',
        //   styleClass: 'inline-checkbox col-12',
        //   additional: {
        //     block: 'objectives'
        //   }
        // }
      ],
      blocks: [{title: '', key: 'objectives'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE',
      recordType: RecordType.REFERENCE_TYPE
    }
  },
  {
    title: 'Сердечный тон',
    type: 'list',
    name: 'heart-tone',
    method: 'getReferenceTypeListHeartToneUsingGET',
    block: 'objectives',
    paramsOrder: ['name', 'code'],
    filters: [
      {
        label: 'Наименование:',
        key: 'name',
        type: 'text',
        styleClass: 'col-2',
      },
      {
        label: 'Код:',
        key: 'code',
        type: 'text',
        styleClass: 'col-1',
      },
    ],
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
        // {
        //   label: 'Удаленная запись',
        //   key: 'isDeleted',
        //   type: 'checkbox',
        //   styleClass: 'inline-checkbox col-12',
        //   additional: {
        //     block: 'objectives'
        //   }
        // }
      ],
      blocks: [{title: '', key: 'objectives'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE',
      recordType: RecordType.REFERENCE_TYPE
    }
  },
  {
    title: 'Инциденты',
    type: 'list',
    name: 'incident',
    method: 'getReferenceTypeListIncidentUsingGET',
    block: 'objectives',
    paramsOrder: ['name', 'code'],
    filters: [
      {
        label: 'Наименование:',
        key: 'name',
        type: 'text',
        styleClass: 'col-2',
      },
      {
        label: 'Код:',
        key: 'code',
        type: 'text',
        styleClass: 'col-1',
      },
    ],
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
        // {
        //   label: 'Удаленная запись',
        //   key: 'isDeleted',
        //   type: 'checkbox',
        //   styleClass: 'inline-checkbox col-12',
        //   additional: {
        //     block: 'objectives'
        //   }
        // }
      ],
      blocks: [{title: '', key: 'objectives'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE',
      recordType: RecordType.REFERENCE_TYPE
    }
  },
  {
    title: 'Интоксикация',
    type: 'list',
    name: 'intoxication',
    method: 'getReferenceTypeListIntoxicationUsingGET',
    block: 'objectives',
    paramsOrder: ['name', 'code'],
    filters: [
      {
        label: 'Наименование:',
        key: 'name',
        type: 'text',
        styleClass: 'col-2',
      },
      {
        label: 'Код:',
        key: 'code',
        type: 'text',
        styleClass: 'col-1',
      },
    ],
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
        // {
        //   label: 'Удаленная запись',
        //   key: 'isDeleted',
        //   type: 'checkbox',
        //   styleClass: 'inline-checkbox col-12',
        //   additional: {
        //     block: 'objectives'
        //   }
        // }
      ],
      blocks: [{title: '', key: 'objectives'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE',
      recordType: RecordType.REFERENCE_TYPE
    }
  },
  {
    title: 'Хрип в легких',
    type: 'list',
    name: 'lungs-wheezing',
    method: 'getReferenceTypeListLungsWheezingUsingGET',
    block: 'objectives',
    paramsOrder: ['name', 'code'],
    filters: [
      {
        label: 'Наименование:',
        key: 'name',
        type: 'text',
        styleClass: 'col-2',
      },
      {
        label: 'Код:',
        key: 'code',
        type: 'text',
        styleClass: 'col-1',
      },
    ],
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
        // {
        //   label: 'Удаленная запись',
        //   key: 'isDeleted',
        //   type: 'checkbox',
        //   styleClass: 'inline-checkbox col-12',
        //   additional: {
        //     block: 'objectives'
        //   }
        // }
      ],
      blocks: [{title: '', key: 'objectives'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE',
      recordType: RecordType.REFERENCE_TYPE
    }
  },
  {
    title: 'Перкуторный звук над легкими',
    type: 'list',
    name: 'lungs-perc',
    method: 'getReferenceTypeListPercLungsSoundUsingGET',
    block: 'objectives',
    paramsOrder: ['name', 'code'],
    filters: [
      {
        label: 'Наименование:',
        key: 'name',
        type: 'text',
        styleClass: 'col-2',
      },
      {
        label: 'Код:',
        key: 'code',
        type: 'text',
        styleClass: 'col-1',
      },
    ],
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
        // {
        //   label: 'Удаленная запись',
        //   key: 'isDeleted',
        //   type: 'checkbox',
        //   styleClass: 'inline-checkbox col-12',
        //   additional: {
        //     block: 'objectives'
        //   }
        // }
      ],
      blocks: [{title: '', key: 'objectives'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE',
      recordType: RecordType.REFERENCE_TYPE
    }
  },
  {
    title: 'Социальные категории пациентов',
    type: 'list',
    name: 'patient-social-type',
    method: 'getReferenceTypeListPatientSocialTypeUsingGET',
    block: 'common',
    paramsOrder: ['name', 'code'],
    filters: [
      {
        label: 'Наименование:',
        key: 'name',
        type: 'text',
        styleClass: 'col-2',
      },
      {
        label: 'Код:',
        key: 'code',
        type: 'text',
        styleClass: 'col-1',
      },
    ],
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
            block: 'common'
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
      deleteMethod: 'deleteReferenceTypeUsingDELETE',
      recordType: RecordType.REFERENCE_TYPE
    }
  },
  {
    title: 'Документы пациентов',
    type: 'list',
    name: 'patient-source-type', // todo: перепроверить этот справочник
    method: 'getDocumentTypeListUsingGET',
    block: 'common',
    paramsOrder: ['name', 'code'],
    filters: [
      {
        label: 'Наименование:',
        key: 'name',
        type: 'text',
        styleClass: 'col-2',
      },
      {
        label: 'Код:',
        key: 'code',
        type: 'text',
        styleClass: 'col-1',
      },
    ],
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
        // {
        //   label: 'Тип',
        //   key: 'type',
        //   type: 'text',
        //   styleClass: '',
        //   additional: {
        //     block: 'common'
        //   },
        //   hide: true,
        //   presetValue: 'PATIENT_SOURCE_TYPE'
        // },
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
      method: 'getDocumentTypeUsingGET',
      restoreMethod: 'restoreDocumentTypeUsingPOST',
      saveMethod: 'updateDocumentTypeUsingPOST',
      deleteMethod: 'deleteDocumentTypeUsingDELETE',
      // recordType: RecordType.REFERENCE_TYPE
    }
  },
  {
    title: 'Места жительство пациентов',
    type: 'list',
    name: 'patient-type',
    method: 'getReferenceTypeListPatientTypeUsingGET',
    block: 'common',
    paramsOrder: ['name', 'code'],
    filters: [
      {
        label: 'Наименование:',
        key: 'name',
        type: 'text',
        styleClass: 'col-2',
      },
      {
        label: 'Код:',
        key: 'code',
        type: 'text',
        styleClass: 'col-1',
      },
    ],
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
      title: 'Место жительство пациента',
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
          presetValue: 'PATIENT_TYPE'
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
      deleteMethod: 'deleteReferenceTypeUsingDELETE',
      recordType: RecordType.REFERENCE_TYPE
    }
  },
  {
    title: 'Зрачки',
    type: 'list',
    name: 'penalties',
    method: 'getReferenceTypeListPenaltiesUsingGET',
    block: 'objectives',
    paramsOrder: ['name', 'code'],
    filters: [
      {
        label: 'Наименование:',
        key: 'name',
        type: 'text',
        styleClass: 'col-2',
      },
      {
        label: 'Код:',
        key: 'code',
        type: 'text',
        styleClass: 'col-1',
      },
    ],
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
        // {
        //   label: 'Удаленная запись',
        //   key: 'isDeleted',
        //   type: 'checkbox',
        //   styleClass: 'inline-checkbox col-12',
        //   additional: {
        //     block: 'objectives'
        //   }
        // }
      ],
      blocks: [{title: '', key: 'objectives'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE',
      recordType: RecordType.REFERENCE_TYPE
    }
  },
  {
    title: 'Зрачки D_S',
    type: 'list',
    name: 'penalties-ds',
    method: 'getReferenceTypeListPenaltiesDSUsingGET',
    block: 'objectives',
    paramsOrder: ['name', 'code'],
    filters: [
      {
        label: 'Наименование:',
        key: 'name',
        type: 'text',
        styleClass: 'col-2',
      },
      {
        label: 'Код:',
        key: 'code',
        type: 'text',
        styleClass: 'col-1',
      },
    ],
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
        // {
        //   label: 'Удаленная запись',
        //   key: 'isDeleted',
        //   type: 'checkbox',
        //   styleClass: 'inline-checkbox col-12',
        //   additional: {
        //     block: 'objectives'
        //   }
        // }
      ],
      blocks: [{title: '', key: 'objectives'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE',
      recordType: RecordType.REFERENCE_TYPE
    }
  },
  {
    title: 'Рефлексы D_S',
    type: 'list',
    name: 'reflexes-ds',
    method: 'getReferenceTypeListReflexesDSUsingGET',
    block: 'objectives',
    paramsOrder: ['name', 'code'],
    filters: [
      {
        label: 'Наименование:',
        key: 'name',
        type: 'text',
        styleClass: 'col-2',
      },
      {
        label: 'Код:',
        key: 'code',
        type: 'text',
        styleClass: 'col-1',
      },
    ],
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
        // {
        //   label: 'Удаленная запись',
        //   key: 'isDeleted',
        //   type: 'checkbox',
        //   styleClass: 'inline-checkbox col-12',
        //   additional: {
        //     block: 'objectives'
        //   }
        // }
      ],
      blocks: [{title: '', key: 'objectives'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE',
      recordType: RecordType.REFERENCE_TYPE
    }
  },
  {
    title: 'Сухожильные рефлексы',
    type: 'list',
    name: 'reflexes-tendon',
    method: 'getReferenceTypeListTendonReflexesUsingGET',
    block: 'objectives',
    paramsOrder: ['name', 'code'],
    filters: [
      {
        label: 'Наименование:',
        key: 'name',
        type: 'text',
        styleClass: 'col-2',
      },
      {
        label: 'Код:',
        key: 'code',
        type: 'text',
        styleClass: 'col-1',
      },
    ],
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
        // {
        //   label: 'Удаленная запись',
        //   key: 'isDeleted',
        //   type: 'checkbox',
        //   styleClass: 'inline-checkbox col-12',
        //   additional: {
        //     block: 'objectives'
        //   }
        // }
      ],
      blocks: [{title: '', key: 'objectives'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE',
      recordType: RecordType.REFERENCE_TYPE
    }
  },
  {
    title: 'Результатат вызова',
    type: 'list',
    name: 'result',
    method: 'getReferenceTypeListResultUsingGET',
    block: 'calls',
    paramsOrder: ['name', 'code'],

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
        // {
        //   label: 'Удаленная запись',
        //   key: 'isDeleted',
        //   type: 'checkbox',
        //   styleClass: 'inline-checkbox col-12',
        //   additional: {
        //     block: 'objectives'
        //   }
        // }
      ],
      blocks: [{title: '', key: 'objectives'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE',
      recordType: RecordType.REFERENCE_TYPE
    }
  },
  {
    title: 'Причина результатов',
    type: 'list',
    name: 'result-cause',
    method: 'getReferenceTypeListResultCauseUsingGET',
    block: 'objectives',
    paramsOrder: ['name', 'code'],
    filters: [
      {
        label: 'Наименование:',
        key: 'name',
        type: 'text',
        styleClass: 'col-2',
      },
      {
        label: 'Код:',
        key: 'code',
        type: 'text',
        styleClass: 'col-1',
      },
    ],
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
        // {
        //   label: 'Удаленная запись',
        //   key: 'isDeleted',
        //   type: 'checkbox',
        //   styleClass: 'inline-checkbox col-12',
        //   additional: {
        //     block: 'objectives'
        //   }
        // }
      ],
      blocks: [{title: '', key: 'objectives'}],
      method: 'getReferenceTypeUsingGET',
      restoreMethod: 'restoreReferenceTypeUsingPOST',
      saveMethod: 'updateReferenceTypeUsingPOST',
      deleteMethod: 'deleteReferenceTypeUsingDELETE',
      recordType: RecordType.REFERENCE_TYPE
    }
  },
  {
    title: 'Виды медицинской эвакуации',
    type: 'list',
    name: 'transportation',
    method: 'getReferenceTypeListTransportationUsingGET',
    block: 'common',
    params: {type: 'TRANSPORTATION'},
    paramsOrder: ['type', 'name', 'code'],
    filters: [
      {
        label: 'Тип',
        type: 'dict',
        key: 'type',
        dict: 'getReferenceTypeListTransportationMethodUsingGET',
        bindValue: 'id',
        styleClass: 'col-1',
        hide: true,
        presetValue: 'TRANSPORTATION'
      },
      {
        label: 'Наименование:',
        key: 'name',
        type: 'text',
        styleClass: 'col-2',
      },
      {
        label: 'Код:',
        key: 'code',
        type: 'text',
        styleClass: 'col-1',
      },
    ],
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
      title: 'Вид медицинской эвакуации',
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
          presetValue: 'TRANSPORTATION'
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
      deleteMethod: 'deleteReferenceTypeUsingDELETE',
      recordType: RecordType.REFERENCE_TYPE
    }
  },
  {
    title: 'Методы транспортировки',
    type: 'list',
    name: 'transportation-method',
    method: 'getReferenceTypeListTransportationMethodUsingGET',
    block: 'common',
    paramsOrder: ['name', 'code'],
    filters: [
      {
        label: 'Наименование:',
        key: 'name',
        type: 'text',
        styleClass: 'col-2',
      },
      {
        label: 'Код:',
        key: 'code',
        type: 'text',
        styleClass: 'col-1',
      },
    ],
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
            block: 'common'
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
      deleteMethod: 'deleteReferenceTypeUsingDELETE',
      recordType: RecordType.REFERENCE_TYPE
    }
  },
  {
    title: 'Медсредства',
    type: 'list',
    name: 'medications',
    method: 'getDrugNewListUsingGET',
    block: 'drugStore2',
    colDef: [
      {
        headerName: 'Наименование',
        field: 'name',
      },
      {
        headerName: 'Лекарственная форма',
        field: 'drugFormBeanFK.name'
      },
      {
        headerName: 'Вид лекарственного препарата',
        field: 'drugTypeBeanFK.name'
      },
      {
        headerName: 'Единица измерения',
        field: 'unitNewBeanFK.name',
        width: 100
      },
      {
        headerName: 'Анатомо-терапевтическо -химическая классификация (АТХ)',
        field: 'athBeanFK.name'
      },
    ],
    item: {
      title: 'Медсредство',
      descriptions: [
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'drugStore2'
          }
        },
        {
          label: 'Лекарственная форма:',
          key: 'drugFormBeanFK',
          type: 'dict',
          dict: 'listFormUsingGET',
          styleClass: '',
          additional: {
            block: 'drugStore2'
          }
        },
        {
          label: 'Вид лекарственного препарата:',
          key: 'drugTypeBeanFK',
          type: 'dict',
          dict: 'listTypeUsingGET',
          styleClass: '',
          additional: {
            block: 'drugStore2'
          }
        },
        {
          label: 'Единица измерения:',
          key: 'unitNewBeanFK',
          type: 'dict',
          dict: 'listUnitUsingGET',
          styleClass: '',
          additional: {
            block: 'drugStore2'
          }
        },
        {
          label: 'Анатомо-терапевтическо-химическая классификация (АТХ):',
          key: 'athBeanFK',
          type: 'dict',
          dict: 'listAthUsingGET',
          styleClass: '',
          additional: {
            block: 'drugStore2'
          }
        },
      ],
      blocks: [{title: '', key: 'drugStore2'}],
      method: 'getDrugNewUsingGET',
      restoreMethod: 'restoreDrugNewUsingGET',
      saveMethod: 'updateDrugNewUsingPOST',
      deleteMethod: 'deleteDrugNewUsingDELETE',
      bean: DrugNewBean
    }
  },
  {
    title: 'Виды лекарственных средств',
    type: 'list',
    name: 'type-medication',
    method: 'listTypeUsingGET',
    block: 'drugStore2',
    colDef: [
      {
        headerName: 'Наименование',
        field: 'name',
        width: 250
      },
    ],
    item: {
      title: 'Вид лекарственного средства',
      descriptions: [
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'drugStore2'
          }
        },
      ],
      blocks: [{title: '', key: 'drugStore2'}],
      method: 'getTypeUsingGET',
      restoreMethod: 'restoreTypeUsingGET',
      saveMethod: 'updateTypeUsingPOST',
      deleteMethod: 'deleteTypeUsingDELETE',
    }
  },
  {
    title: 'Единицы измерения',
    type: 'list',
    name: 'units2',
    method: 'listUnitUsingGET',
    block: 'drugStore2',
    colDef: [
      {
        headerName: 'Наименование',
        field: 'name',
        width: 250
      },
    ],
    item: {
      title: 'Единица измерения',
      descriptions: [
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'drugStore2'
          }
        },
      ],
      blocks: [{title: '', key: 'drugStore2'}],
      method: 'getUnitUsingGET_1',
      restoreMethod: 'restoreUnitUsingGET',
      saveMethod: 'updateUnitDrugUsingPOST',
      deleteMethod: 'deleteUnitUsingDELETE_1',
    }
  },
  {
    title: 'Места хранения',
    type: 'list',
    name: 'bags-templates',
    method: 'listBagsUsingGET',
    block: 'drugStore2',
    colDef: [
      {
        headerName: 'Наименование',
        field: 'name',
        width: 250
      },
    ],
    item: {
      title: 'Место хранения',
      descriptions: [
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'drugStore2'
          }
        },
      ],
      blocks: [{title: '', key: 'drugStore2'}],
      method: 'getTmpBagUsingGET',
      restoreMethod: 'restoreTmpBagUsingGET',
      saveMethod: 'updateBagNewUsingPOST',
      deleteMethod: 'deleteTmpBagUsingDELETE',
    }
  },
  // Группы медсредств
  {
    title: 'Группы медсредств',
    type: 'list',
    name: 'ware-types',
    method: 'listWaresAndOthersUsingGET',
    block: 'drugStore2',
    colDef: [
      {
        headerName: 'Наименование',
        field: 'name',
        width: 250
      },
    ],
    item: {
      title: 'Группа медсредства',
      descriptions: [
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'drugStore2'
          }
        },
      ],
      blocks: [{title: '', key: 'drugStore2'}],
      method: '',
      restoreMethod: '',
      saveMethod: '',
      deleteMethod: '',
    }
  },
  // Виды упаковок
  {
    title: 'Виды упаковок',
    type: 'list',
    name: 'package-types',
    method: 'getDrugPackagesUsingGET',
    block: 'drugStore2',
    colDef: [
      {
        headerName: 'Наименование',
        field: 'name',
        width: 250
      },
    ],
    item: {
      title: 'Группа медсредства',
      descriptions: [
        {
          label: 'Наименование:',
          key: 'name',
          type: 'text',
          styleClass: '',
          additional: {
            block: 'drugStore2'
          }
        },
      ],
      blocks: [{title: '', key: 'drugStore2'}],
      method: '',
      restoreMethod: '',
      saveMethod: '',
      deleteMethod: '',
    }
  },

];

export const getListOfDictionaries = (block: string, filter: string) => {
  return dictionaries.filter(
    el => {
      if (filter && el.title) {
        const upperLabel = el.title.toUpperCase(); // приводим к заглавным для поиска
        return (el.block === block && upperLabel.includes(filter.toUpperCase()));
      } else {
        return el.block === block;
      }
    }
  );
};

export const getDictInfo = (name: string) => {
  return {...dictionaries.find(el => el.name === name)};
};
