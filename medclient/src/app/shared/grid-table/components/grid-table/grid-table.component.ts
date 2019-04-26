import {Component, Input, OnInit} from '@angular/core';
import {getGridLocaleRu} from '../../grid-locale-ru';

@Component({
  selector: 'app-grid-table',
  templateUrl: './grid-table.component.html',
  styleUrls: ['./grid-table.component.scss']
})
export class GridTableComponent implements OnInit {
  @Input() listSource: any[];
  @Input() columnDefs;

  _columnDefs;
  _listSource;

  localeText = getGridLocaleRu();



  constructor() {
  }

  ngOnInit() {
    this._listSource = this.listSource;
    this._columnDefs = this.columnDefs;
  }

  onFirstDataRendered(params) { // подгон  колонок под ширину экрана
    params.api.sizeColumnsToFit();
  }

}
