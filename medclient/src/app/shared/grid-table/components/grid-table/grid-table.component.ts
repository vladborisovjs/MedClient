import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {getGridLocaleRu} from '../../grid-locale-ru';
import {GridApi, IGetRowsParams} from 'ag-grid-community';
import {Observable} from 'rxjs';
import {cloneDeep} from 'lodash/lang';
import {HttpErrorResponse} from '@angular/common/http';


export interface IListContainer {
  list?: any[];
  size?: number;
  total?: number;
}

export interface IGridTableDataSource {
  get(filter: any, offset: number, count: number): Observable<IListContainer>;
}

@Component({
  selector: 'app-grid-table',
  templateUrl: './grid-table.component.html',
  styleUrls: ['./grid-table.component.scss']
})
export class GridTableComponent implements OnInit, OnChanges {
  @Input() columnDefs;
  @Input() dataSource: IGridTableDataSource;
  @Input() filter;
  // @Input() frameworkComponents;
  @Input() pageSize = 50;
  @Input() startPage = 1;
  @Input() deleteButton = false;
  @Input() gridOptions;
  @Input() frameworkComponents;
  @Input() enableFilter = true;
  @Input() listSource: any[];
  @Input() multiSelect = false;
  @Input() draggable = false;
  @Input() allowDrag: boolean;
  @Input() animated = false;
  @Input() sorting = true;
  @Input() pagination = true;
  @Input() sizeColumnsToFit = true; // подгон  колонок под ширину экрана
  @Output() onGridReady = new EventEmitter();
  @Output() onRowDblClick = new EventEmitter();
  @Output() onRowClick = new EventEmitter();
  @Output() onRowSelect = new EventEmitter();
  @Output() onDataLoaded = new EventEmitter();
  @Output() onRowDeleted = new EventEmitter();
  @Output() onSortChanged = new EventEmitter();
  @Output() onFilterChanged = new EventEmitter();
  @Output() rowDragEnd = new EventEmitter();
  @Output() paginationChanged = new EventEmitter();
  @Output() firstDataRendered = new EventEmitter();

  gridApi: GridApi;
  gridColumnApi;
  context;
  // _frameworkComponents = {
  //   deleteRenderer: GridTableDeleteRowComponent
  // };
  localeText = getGridLocaleRu();

  _dataSource;
  _columnDefs;
  _listSource;



  constructor() {
  }

  ngOnInit() {
    if (this.allowDrag === undefined) {
      this.allowDrag = this.draggable;
    }
    this.setDataSource();
  }


  setDataSource() {
    if (this.listSource) {
      this._listSource = this.listSource;
      this.dataSource = null;
      this._dataSource = null;
    }
    if (this.dataSource) {
      this._dataSource = {
        getRows: (params: IGetRowsParams) => {
          let offset = params.startRow;
          let count = params.endRow - params.startRow;
          this.gridApi.showLoadingOverlay();
          this.dataSource.get(this.filter, offset, count).subscribe((data) => {
            params.successCallback(data.list, data.total);
            this.onDataLoaded.emit(data.list);
          }, (data: HttpErrorResponse) => {
            console.log(data);
            // this.notifications.error(data.error, data.message);
            // this.notifications.error('Ошибка', 'Не удалось получить данные для таблицы');
          }, () => {
            this.gridApi.hideOverlay();
          });
        }
      };
    }
  }

  gridReady(options) {
    options.api.doLayout();
    this.gridApi = options.api;
    this.gridApi.setSuppressRowDrag(!this.allowDrag);
    this.gridColumnApi = options.columnApi;
    this.onGridReady.emit(options);
    this.context = {componentParent: this};
    this.updateDataSource();
  }

  updateDataSource() {
    if (this.gridApi) {
      this.setDataSource();
      if (this._dataSource) {
        this.gridApi.setDatasource(this._dataSource);
      }
    }
  }

  rowDoubleClicked(e) {
    this.onRowDblClick.emit(e);
  }

  roweClicked(e) {
    this.onRowClick.emit(e);
  }

  onFirstDataRendered(params) { // подгон  колонок под ширину экрана
    if (this.sizeColumnsToFit) {
      params.api.sizeColumnsToFit();
      console.log('подгонка');
    }
    this.firstDataRendered.emit(params);
  }

  rowSelected(e) {
    if (e.node.selected) {
      if (this.multiSelect) {
        this.onRowSelect.emit(this.gridApi.getSelectedRows());
      } else {
        this.onRowSelect.emit(e.data);
      }
    } else if (this.gridApi.getSelectedRows().length === 0) {
      this.onRowSelect.emit(null);
    }
  }

  sortChange(e) {
    this.onSortChanged.emit(e.api.getSortModel());
  }

  filterChange(e) {
    this.onFilterChanged.emit(e.api.getFilterModel());
  }

  rowDragHasEnd(e) {
    this.rowDragEnd.emit(e);
  }

  ngOnChanges(changes) {

    if (changes.filter || changes.dataSource || changes.listSource) {
      this.updateDataSource();
    }
    if (changes.columnDefs) {
      this._columnDefs = cloneDeep(this.columnDefs);
      if (this.deleteButton === true) {
        this._columnDefs.push({
          headerName: '',
          cellRenderer: 'deleteRenderer',
          width: 50,
          maxWidth: 50,
          pinned: 'right',
          suppressResize: false
        });
      }
    }
    // if (changes.frameworkComponents) {
    //   for (const key in this.frameworkComponents) {
    //     if (this.frameworkComponents.hasOwnProperty(key)) {
    //       this._frameworkComponents[key] = this.frameworkComponents[key];
    //     }
    //   }
    // }
    if (changes.allowDrag && !changes.allowDrag.firstChange) {
      this.gridApi.setSuppressRowDrag(!this.allowDrag);
    }
  }

}
