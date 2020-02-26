import { Component, OnInit } from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {BagTemplateBean} from '../../../../../swagger/med-api.service';
import {DrugstoreService} from '../../services/drugstore.service';

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
    {
      headerName: 'Тип бригады',
      field: 'brigadeTypeFK.name',
    },
  ];
  filters: any = {
    deleted: false,
  };
  constructor(public ds: DrugstoreService,) { }

  ngOnInit() {
  }

  selectBagTemplate(e){
    this.ds.selectBagTemplate(e.data);
  }

  createBagTemplate(){
    this.ds.selectBagTemplate(BagTemplateBean.fromJS({id: 0, isDeleted: false, drugList: []}));
  }


}
