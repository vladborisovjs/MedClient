const localeText = {
  // for filter panel
  page: 'стр.',
  more: 'Ещё',
  to: '-',
  of: 'из',
  next: '►',
  last: '►►',
  first: '◄◄',
  previous: '◄',
  loadingOoo: 'Загрузка...',

  // for set filter
  selectAll: 'Выбрать все',
  searchOoo: 'Поиск...',
  blanks: 'Пусто',

  // for number filter and text filter
  filterOoo: 'фильтр...',
  applyFilter: 'Применение фильтрации...',

  // for number filter
  notEqual: 'Не равно',
  equals: 'Равно',
  lessThan: 'Меньше чем',
  greaterThan: 'Больше чем',

  // for text filter
  contains: 'Содержит',
  notContains: 'Не содержит',
  startsWith: 'Начинается с',
  endsWith: 'Заканчивается на',

  // the header of the default group column
  group: 'Группа',

  // tool panel
  columns: 'Столбцы',
  rowGroupColumns: 'laPivot Cols',
  rowGroupColumnsEmptyMessage: 'la drag cols to group',
  valueColumns: 'laValue Cols',
  pivotMode: 'laPivot-Mode',
  groups: 'Группы',
  values: 'Значение',
  pivots: 'laPivots',
  valueColumnsEmptyMessage: 'la drag cols to aggregate',
  pivotColumnsEmptyMessage: 'la drag here to pivot',
  toolPanelButton: 'Панель инструментов',

  // other
  noRowsToShow: 'Нет записей для отображения',

  // enterprise menu aggregation and status panel
  sum: 'Сумма',
  min: 'Мин',
  max: 'Макс',
  none: 'None',
  count: 'Количество',
  average: 'Среднее',

  // standard menu
  copy: 'Копирвоать',
  copyWithHeaders: 'Копировать с хедерами',
  ctrlC: 'ctrl + C',
  paste: 'Вставаить',
  ctrlV: 'ctrl + V'
};

export function getGridLocaleRu() {
  return {...localeText};
}
