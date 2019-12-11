import {Component, OnInit} from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {DrugstoreBagService} from '../../services/drugstore-bag.service';

@Component({
  selector: 'app-drug-bag-templates-list',
  templateUrl: './drug-bag-templates-list.component.html',
  styleUrls: ['./drug-bag-templates-list.component.scss']
})
export class DrugBagTemplatesListComponent implements OnInit {
  colDef: ColDef[] = [
    {
      headerName: 'Наименование',
      field: 'name',
    },
  ];
  filters: any = {
    deleted: false,
  };
  constructor(public ds: DrugstoreBagService,) { }

  ngOnInit() {
  }

  selectBagTemplateFromTable(e){
    this.ds.selectBagTemplate(e.data);
  }
}
