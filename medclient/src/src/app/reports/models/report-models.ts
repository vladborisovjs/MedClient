import {ISimpleDescription} from "../../shared/simple-control/services/simple-description.service";

export interface IReport {
  title: string, // наименование отчета
  url?: string, // api method url
  block?: string,
  urlParams?: IReportUrlParams[],// все url параметры метода
  inputParams?: IReportInputParams[] // параметры метода, для пользовательского ввода
}

export interface IReportUrlParams {
  name: string, // наименование параметра
  subdivisionId?: boolean, // true - для автоматической подстановки id подразделения текущего пользователя
}

export interface IReportInputParams {
  name?: string,
  day?: boolean, // выбор дня, возвращает dateFrom , dateTo
  period?: boolean, // возврат диапазона дат
  month?: boolean, // возврат месяца и года
  subdivision?: boolean, // возврат id подразделения
  subdivisionList?: boolean, // возврат массивва id подразделения
  multiplePrint?: boolean, // флаг для множественной печати
  type?: string, // тип графика
  typeDoc?: boolean, // тип документа Отчет/График
  description?: ISimpleDescription // конфигурация формы для ввода параметра
}


export const reportsList: IReport[] = [

  {
    title: 'Журнал записи вызовов скорой медицинской помощи (Форма 109/y)',
    url: '/api/reports/report109',
    block: 'common',
    urlParams: [
      {
        name: 'subdivision',
      },
      {
        name: 'dateFrom',
      },
      {
        name: 'dateTo',
      },
    ],
    inputParams: [
      {period: true},
      {subdivision: true}
    ]
  },

  {
    title: 'Дневник работы станции скорой медицинской помощи (Форма 115/y)',
    url: '/api/reports/report115',
    block: 'common',
    urlParams: [
      {
        name: 'subdivision',
      },
      {
        name: 'dateFrom',
      },
      {
        name: 'dateTo',
      },
    ],
    inputParams: [
      {period: true},
      {subdivision: true}
    ]
  },
  {
    title: 'Работа сотрудников района',
    url: '/api/reports/jasperScheduleContainer',
    block: 'scheduleEmployes',
    urlParams: [
      {
        name: 'typeDoc',
      },
      {
        name: 'subdivision',
      },
      {
        name: 'dateFrom',
      },
      {
        name: 'dateTo',
      },
      {
        name: 'type'
      }
    ],
    inputParams: [
      {typeDoc: true},
      {month: true},
      {subdivision: true},
      {
        type: 'EMPLOYEES'
      },
    ]
  },
  {
    title: 'Работа бригад СМП',
    url: '/api/reports/jasperScheduleContainer',
    block: 'scheduleBrigade',
    urlParams: [
      {
        name: 'typeDoc',
      },
      {
        name: 'subdivision',
      },
      {
        name: 'dateFrom',
      },
      {
        name: 'dateTo',
      },
      {
        name: 'type'
      }
    ],
    inputParams: [
      {typeDoc: true},
      {month: true},
      {subdivision: true},
      {
        type: 'BRIGADE'
      },
    ]
  },
  {
    title: 'Ежедневная сводка по работе скорой медицинской помощи за смену',
    url: '/api/reports/dailySummary',
    block: 'common',
    urlParams: [
      {
        name: 'subdivision',
      },
      {
        name: 'dateFrom',
      },
      {
        name: 'dateTo',
      },
    ],
    inputParams: [
      {day:true},
      {subdivisionList:true},
      {multiplePrint: true},
    ]
  },
  {
    title: 'Работа сотрудников бригад СМП',
    url: '/api/reports/jasperScheduleContainer',
    block: 'common',
    urlParams: [
      {
        name: 'typeDoc',
      },
      {
        name: 'subdivision',
      },
      {
        name: 'dateFrom',
      },
      {
        name: 'dateTo',
      },
      {
        name: 'type'
      }
    ],
    inputParams: [
      {typeDoc: true},
      {month: true},
      {subdivision: true},
      {
        type: 'DOCTORS',
      },

    ]
  },
  {
    title: 'Работа водителей бригад СМП',
    url: '/api/reports/jasperScheduleContainer',
    block: 'common',
    urlParams: [
      {
        name: 'typeDoc',
      },
      {
        name: 'subdivision',
      },
      {
        name: 'dateFrom',
      },
      {
        name: 'dateTo',
      },
      {
        name: 'type'
      }
    ],
    inputParams: [
      {typeDoc: true},
      {month: true},
      {subdivision: true},
      {
        type: 'DRIVERS'
      },
    ]
  },
  {
    title: 'Отчет по санавиации',
    url: '/api/reports/reportAvia',
    block: 'common',
    urlParams: [
      {
        name: 'subdivision',
      },
      {
        name: 'dateFrom'
      },
      {
        name: 'dateTo'
      }
    ],
    inputParams: [
      {period: true},
      {subdivision: true}
    ]
  },
  {
    title: 'Форма 2120',
    url: '/api/reports/report2120',
    block: 'statistical',
    urlParams: [
      {
        name: 'subdivision',
      },
      {
        name: 'dateFrom',
      },
      {
        name: 'dateTo',
      },
    ],
    inputParams: [
      {period: true},
      {subdivision: true}
    ]
  },
  {
    title: 'Форма 2121',
    url: '/api/reports/report2121',
    block: 'statistical',
    urlParams: [
      {
        name: 'subdivision',
      },
      {
        name: 'dateFrom',
      },
      {
        name: 'dateTo',
      },
    ],
    inputParams: [
      {period: true},
      {subdivision: true}
    ]
  },
  {
    title: 'Форма 2200',
    url: '/api/reports/report2200',
    block: 'statistical',
    urlParams: [
      {
        name: 'subdivision',
      },
      {
        name: 'dateFrom',
      },
      {
        name: 'dateTo',
      },
    ],
    inputParams: [
      {period: true},
      {subdivision: true}
    ]
  },
  {
    title: 'Форма 2201',
    url: '/api/reports/report2201',
    block: 'statistical',
    urlParams: [
      {
        name: 'subdivision',
      },
      {
        name: 'dateFrom',
      },
      {
        name: 'dateTo',
      },
    ],
    inputParams: [
      {period: true},
      {subdivision: true}
    ]
  },
  {
    title: 'Форма 2202',
    url: '/api/reports/report2202',
    block: 'statistical',
    urlParams: [
      {
        name: 'subdivision',
      },
      {
        name: 'dateFrom',
      },
      {
        name: 'dateTo',
      },
    ],
    inputParams: [
      {period: true},
      {subdivision: true}
    ]
  },
  {
    title: 'Форма 2300',
    url: '/api/reports/report2300',
    block: 'statistical',
    urlParams: [
      {
        name: 'subdivision',
      },
      {
        name: 'dateFrom',
      },
      {
        name: 'dateTo',
      },
    ],
    inputParams: [
      {period: true},
      {subdivision: true}
    ]
  },
  {
    title: 'Форма 2350',
    url: '/api/reports/report2350',
    block: 'statistical',
    urlParams: [
      {
        name: 'subdivision',
      },
      {
        name: 'dateFrom',
      },
      {
        name: 'dateTo',
      },
    ],
    inputParams: [
      {period: true},
      {subdivision: true}
    ]
  },
  {
    title: 'Работа районов',
    url: '/api/reports/reportWorkSubdivisions',
    block: 'statistical',
    urlParams: [
      {
        name: 'subdivision',
      },
      {
        name: 'dateFrom',
      },
      {
        name: 'dateTo',
      },
    ],
    inputParams: [
      {period: true},
      {subdivisionList: true}
    ]
  },
];
