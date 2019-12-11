import {ISimpleDescription} from "../../shared/simple-control/services/simple-description.service";

export interface IReport {
  title: string, // наименование отчета
  url?: string, // api method url
  block?: string,
  urlParams?: IReportUrlParams[],// все url параметры метода
  inputParams?: IReportInputParams[] // параметры метода, для пользовательского ввода
}

export interface IReportUrlParams {
  name: string, // наименование пораметра
  subdivisionId?: boolean, // true - для автоматической подстановки id подразделения текущего пользователя
}

export interface IReportInputParams {
  name?: string,
  day?: boolean, // выбор дня, возвращает dateFrom , dateTo
  period?: boolean, // возврат диапазона дат
  month?: boolean, // возврат месяца и года
  subdivision?: boolean, // возврат id подразделения
  type?: string, // тип графика
  description?: ISimpleDescription // конфигурация формы для ввода параметра
}


export const reportsList: IReport[] = [

  {
    title: 'Журнал записи вызовов скорой медицинской помощи (Форма 109/y)',
    url: '/api/andy/reports/report109',
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
    url: '/api/andy/reports/report115',
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
    title: 'График работы сотрудников на выбранный период',
    url: '/api/andy/reports/jasperScheduleContainer',
    block: 'scheduleEmployes',
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
      {
        name: 'type'
      }
    ],
    inputParams: [
      {month: true},
      {subdivision: true},
      {
        type: 'EMPLOYEES'
      }
    ]
  },
  {
    title: 'График работы бригад на выбранный период',
    url: '/api/andy/reports/jasperScheduleContainer',
    block: 'scheduleBrigade',
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
      {
        name: 'type'
      }
    ],
    inputParams: [
      {month: true},
      {subdivision: true},
      {
        type: 'BRIGADE'
      }
    ]
  },
  {
    title: 'Ежедневная сводка по работе скорой медицинской помощи за смену',
    url: '/api/andy/reports/dailySummary',
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
      {subdivision:true}
    ]
  },
  {
    title: 'Отчет о работе бригад скорой медицинской помощи',
    url: '/api/andy/reports/jasperScheduleContainer',
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
      {
        name: 'type'
      }
    ],
    inputParams: [
      {month: true},
      {subdivision: true},
      {
        type: 'DOCTORS',
      }
    ]
  },
  {
    title: 'Отчет по работе водителей',
    url: '/api/andy/reports/jasperScheduleContainer',
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
      {
        name: 'type'
      }
    ],
    inputParams: [
      {month: true},
      {subdivision: true},
      {
        type: 'DRIVERS'
      }
    ]
  },
  {
    title: 'Отчет по санавиации',
    url: '/api/andy/reports/reportAvia',
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
    url: '/api/andy/reports/report2120',
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
    url: '/api/andy/reports/report2121',
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
    url: '/api/andy/reports/report2200',
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
    url: '/api/andy/reports/report2201',
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
    url: '/api/andy/reports/report2202',
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
    url: '/api/andy/reports/report2300',
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
    url: '/api/andy/reports/report2350',
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
];
