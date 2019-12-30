export enum _Roles {
  ADMIN = 'ADMIN', // Администратор
  DISTRICT_ADMIN = 'DISTRICT_ADMIN', // Администратор района
  SCHEDULE_MASTER = 'SCHEDULE_MASTER', // "Старший врач смены
  CALL_DISPATCHER = 'CALL_DISPATCHER', // Диспетчер приема вызовов
  HOSPITALIZATION_DISPATCHER = 'HOSPITALIZATION_DISPATCHER', // Диспетчер госпитализации
  DIRECTION_DISPATCHER = 'DIRECTION_DISPATCHER', // Диспетчер направления
  TCMK_DISPATCHER = 'TCMK_DISPATCHER', // Специалист ТЦМК
  SUBDIVISION_HEAD = 'SUBDIVISION_HEAD', // Руководитель подразделения СМП
  BRIGADE_MASTER = 'BRIGADE_MASTER', // Старший бригады СМП
  TCMK_HEAD = 'TCMK_HEAD' // Руководитель ТЦМК
}

  // _Roles.CALL_DISPATCHER, // Диспетчер вызовов
   // _Roles.CALL.DIRECTION_DISPATCHER //Диспетчер направления";


  // _Roles.BRIGADE_MASTER, // Старший бригады СМП
  // _Roles.TCMK_DISPATCHER, // Специалист ТЦМК
  // _Roles.TCMK_HEAD, // Руководитель ТЦМК
  // _Roles.ADMIN,
  // _Roles.SCHEDULE_MASTER, // "Старший врач смены
  // _Roles.SUBDIVISION_HEAD // Руководитель подразделения СМП


export  enum _AccessLevels {
  shiftControl = 'shiftControl',
  callsModule = 'callsModule',
  reportModule = 'reportModule',
  dictModule = 'dictModule',
  infoExchangeModule = 'infoExchangeModule',
  adminModule = 'adminModule',
  tcmkModule = 'tcmkModule',
  aviationModule = 'aviationModule',
  armBrigadeModule = 'armBrigadeModule',
  archiveModule = 'archiveModule',
  mapModule = 'mapModule',
  drugBagModule = 'drugBagModule'
}

export interface IAccessLevel {
  name: string;
  rolesR?: _Roles[], // who can see module
  rolesRW?: _Roles[], // who can write module
  selfSubdivision?: boolean // Can use only for self subdivision
}

export interface IAccessOptions {
  level: string, // name of accessLevel
  subdivisionId?: number
}

export const AccessLevels: IAccessLevel[] = [
  {
    name: _AccessLevels.shiftControl,
    rolesRW: [
      _Roles.SCHEDULE_MASTER,
      _Roles.SUBDIVISION_HEAD,
      _Roles.ADMIN,
      _Roles.DISTRICT_ADMIN
    ]
    ,
    rolesR: [
      _Roles.CALL_DISPATCHER,
      _Roles.DIRECTION_DISPATCHER,
      _Roles.HOSPITALIZATION_DISPATCHER,
      _Roles.BRIGADE_MASTER,
      _Roles.TCMK_DISPATCHER,
      _Roles.TCMK_HEAD,

    ],
  },
  {
    name: _AccessLevels.callsModule,
    rolesRW: [
      _Roles.CALL_DISPATCHER, // Диспетчер вызовов
      _Roles.DIRECTION_DISPATCHER, // Диспетчер направления
      _Roles.HOSPITALIZATION_DISPATCHER, // Диспетчер госпитализации
      _Roles.BRIGADE_MASTER, // Старший бригады СМП
      _Roles.ADMIN,
      _Roles.SCHEDULE_MASTER, // "Старший врач смены
      _Roles.TCMK_DISPATCHER, // Специалист ТЦМК
      _Roles.DISTRICT_ADMIN  // Администратор района
    ],
    rolesR: [
      _Roles.SUBDIVISION_HEAD, // Руководитель СМП
      _Roles.TCMK_HEAD, // Руководитель ТЦМК

    ],
  },
  {
    name: _AccessLevels.reportModule,
    rolesRW: [
      _Roles.CALL_DISPATCHER, // Диспетчер вызовов
      _Roles.DIRECTION_DISPATCHER, // Диспетчер направления
      _Roles.DISTRICT_ADMIN,  // Администратор района
      _Roles.BRIGADE_MASTER, // Старший бригады СМП
      _Roles.TCMK_DISPATCHER, // Специалист ТЦМК
      _Roles.TCMK_HEAD, // Руководитель ТЦМК
      _Roles.ADMIN,
      _Roles.SCHEDULE_MASTER, // "Старший врач смены
      _Roles.SUBDIVISION_HEAD, // Руководитель подразделения СМП
      _Roles.HOSPITALIZATION_DISPATCHER, // Диспетчер госпитализации
    ],
    rolesR: [],
  },
  {
    name: _AccessLevels.dictModule,
    rolesRW: [
      _Roles.ADMIN,
      _Roles.TCMK_DISPATCHER, // Специалист ТЦМК

    ],
    rolesR: [
      _Roles.HOSPITALIZATION_DISPATCHER, // Диспетчер госпитализации
      _Roles.DISTRICT_ADMIN,  // Администратор района
      _Roles.CALL_DISPATCHER, // Диспетчер вызовов
      _Roles.DIRECTION_DISPATCHER, // Диспетчер направления
      _Roles.BRIGADE_MASTER, // Старший бригады СМП
      _Roles.TCMK_HEAD, // Руководитель ТЦМК
      _Roles.SCHEDULE_MASTER, // "Старший врач смены
      _Roles.SUBDIVISION_HEAD // Руководитель подразделения СМП
    ],
  },
  {
    name: _AccessLevels.infoExchangeModule,
    rolesRW: [
      _Roles.ADMIN,
      _Roles.SCHEDULE_MASTER, // "Старший врач смены
    ],
    rolesR: [
      _Roles.HOSPITALIZATION_DISPATCHER, // Диспетчер госпитализации
      _Roles.DISTRICT_ADMIN,  // Администратор района
      _Roles.CALL_DISPATCHER, // Диспетчер вызовов
      _Roles.DIRECTION_DISPATCHER, // Диспетчер направления
      _Roles.BRIGADE_MASTER, // Старший бригады СМП
      _Roles.TCMK_DISPATCHER, // Специалист ТЦМК
      _Roles.TCMK_HEAD, // Руководитель ТЦМК
      _Roles.SUBDIVISION_HEAD // Руководитель подразделения СМП
    ],
  },
  {
    name: _AccessLevels.adminModule,
    rolesRW: [
      _Roles.ADMIN,
      _Roles.DISTRICT_ADMIN,  // Администратор района
    ],
    rolesR: [
      _Roles.HOSPITALIZATION_DISPATCHER, // Диспетчер госпитализации
      _Roles.CALL_DISPATCHER, // Диспетчер вызовов
      _Roles.DIRECTION_DISPATCHER, //Диспетчер направления
      _Roles.BRIGADE_MASTER, // Старший бригады СМП
      _Roles.TCMK_DISPATCHER, // Специалист ТЦМК
      _Roles.TCMK_HEAD, // Руководитель ТЦМК
      _Roles.SCHEDULE_MASTER, // "Старший врач смены
      _Roles.SUBDIVISION_HEAD // Руководитель подразделения СМП
    ],
  },
  {
    name: _AccessLevels.tcmkModule,
    rolesRW: [
      _Roles.TCMK_DISPATCHER, // Специалист ТЦМК
      _Roles.TCMK_HEAD, // Руководитель ТЦМК
      _Roles.SCHEDULE_MASTER, // "Старший врач смены
      _Roles.ADMIN,
      ],
    rolesR: [
      _Roles.HOSPITALIZATION_DISPATCHER, // Диспетчер госпитализации
      _Roles.DISTRICT_ADMIN,  // Администратор района
      _Roles.CALL_DISPATCHER, // Диспетчер вызовов
      _Roles.DIRECTION_DISPATCHER, // Диспетчер направления
      _Roles.BRIGADE_MASTER, // Старший бригады СМП
      _Roles.SUBDIVISION_HEAD // Руководитель подразделения СМП
    ],
  },
  {
    name: _AccessLevels.aviationModule,
    rolesRW: [
      _Roles.TCMK_DISPATCHER, // Специалист ТЦМК
      _Roles.TCMK_HEAD, // Руководитель ТЦМК
      _Roles.ADMIN,
    ],
    rolesR: [
      _Roles.SCHEDULE_MASTER, // "Старший врач смены
      _Roles.HOSPITALIZATION_DISPATCHER, // Диспетчер госпитализации
      _Roles.DISTRICT_ADMIN,  // Администратор района
      _Roles.CALL_DISPATCHER, // Диспетчер вызовов
      _Roles.DIRECTION_DISPATCHER, // Диспетчер направления
      _Roles.BRIGADE_MASTER, // Старший бригады СМП
      _Roles.SUBDIVISION_HEAD // Руководитель подразделения СМП
    ],
  },
  {
    name: _AccessLevels.armBrigadeModule,
    rolesRW: [
      _Roles.BRIGADE_MASTER, // Старший бригады СМП
      _Roles.ADMIN,
      _Roles.DISTRICT_ADMIN,  // Администратор района
    ],
    rolesR: [],
  },
  {
    name: _AccessLevels.archiveModule,
    rolesRW: [
      _Roles.ADMIN,
    ],
    rolesR: [
      _Roles.TCMK_DISPATCHER, // Специалист ТЦМК
      _Roles.TCMK_HEAD, // Руководитель ТЦМК
      _Roles.SCHEDULE_MASTER, // "Старший врач смены
      _Roles.HOSPITALIZATION_DISPATCHER, // Диспетчер госпитализации
      _Roles.DISTRICT_ADMIN,  // Администратор района
      _Roles.CALL_DISPATCHER, // Диспетчер вызовов
      _Roles.DIRECTION_DISPATCHER, // Диспетчер направления
      _Roles.BRIGADE_MASTER, // Старший бригады СМП
      _Roles.SUBDIVISION_HEAD // Руководитель подразделения СМП
    ],
  },
  {
    name: _AccessLevels.mapModule,
    rolesRW: [
    ],
    rolesR: [
      _Roles.ADMIN,
      _Roles.TCMK_DISPATCHER, // Специалист ТЦМК
      _Roles.TCMK_HEAD, // Руководитель ТЦМК
      _Roles.SCHEDULE_MASTER, // "Старший врач смены
      _Roles.HOSPITALIZATION_DISPATCHER, // Диспетчер госпитализации
      _Roles.DISTRICT_ADMIN,  // Администратор района
      _Roles.CALL_DISPATCHER, // Диспетчер вызовов
      _Roles.DIRECTION_DISPATCHER, // Диспетчер направления
      _Roles.BRIGADE_MASTER, // Старший бригады СМП
      _Roles.SUBDIVISION_HEAD // Руководитель подразделения СМП
    ],
  },
  {
    name: _AccessLevels.drugBagModule,
    rolesRW: [
      _Roles.ADMIN,
      _Roles.SUBDIVISION_HEAD, // Руководитель подразделения СМП
      _Roles.DISTRICT_ADMIN,  // Администратор района
    ],
    rolesR: [
      _Roles.SCHEDULE_MASTER, // "Старший врач смены
      _Roles.BRIGADE_MASTER, // Старший бригады СМП
      _Roles.CALL_DISPATCHER, // Диспетчер вызовов
      _Roles.DIRECTION_DISPATCHER, // Диспетчер направления
      _Roles.TCMK_DISPATCHER, // Специалист ТЦМК
      _Roles.TCMK_HEAD, // Руководитель ТЦМК
      _Roles.HOSPITALIZATION_DISPATCHER, // Диспетчер госпитализации
    ],
  },
];


