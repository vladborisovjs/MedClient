export enum ACTIONS {
  CREATE,
  UPDATE,
  DELETE,
  RESTORE,
  CALL_TRANSFER,
  BRIGADE_ASSIGNED,
  CALL_ASSIGNED,
  CALL_UNCONFIRMED
}

export enum ACTIONS_RU {
  'Cоздание',
  'Редактирование',
  'Удаление',
  'Восстановление',
  'Передача вызова',
  'Бригада была назначена',
  'Вызов принят',
  'Не принят'
}

export enum RecordType {
  'BRIGADE',
  'BRIGADE_STATUS',
  'BRIGADE_TYPE',
  'SCHEDULE_TYPE',
  'SUBDIVISION',
  'SUBDIVISION_TYPE',
  'PERFORMER',
  'PERFORMER_TYPE',
  'PERFORMER_SHIFT',
  'BRIGADE_SCHEDULE',
  'INQUIRER',
  'REFERENCE_TYPE',
  'SKILL',
  'TRANSPORT',
  'UNIT',
  'CALL',
  'ASSIGNED_BRIGADE_MESSAGE',
  'CARD',
}

export enum RecordType_RU {
  'Бригада',
  'Справочник "Статус бригады"',
  'Тип бригады',
  'Тип расписания',
  'Подразделение',
  'Тип подразделения',
  'Сотрудник',
  'Тип сотрудника',
  'Смена сотрудника',
  'Смена бригады',
  'Опросник',
  'Справочник',
  'Специализация',
  'Транспорт',
  'Единица',
  'Вызов',
  'Сообщение бригады',
  'Карта вызова',
}
