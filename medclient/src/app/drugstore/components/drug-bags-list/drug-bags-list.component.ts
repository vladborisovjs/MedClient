import { Component, OnInit } from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {DrugstoreService} from '../../services/drugstore.service';
import {BagBean} from '../../../../../swagger/med-api.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-drug-bags-list',
  templateUrl: './drug-bags-list.component.html',
  styleUrls: ['./drug-bags-list.component.scss']
})
export class DrugBagsListComponent implements OnInit {
  colDef: ColDef[] = [
    {
      headerName: 'Наименование',
      field: 'name',
    },
    {
      headerName: 'Бригада',
      field: 'brigadeFK.name',
    },
  ];
  filters: any = {
    deleted: false,
  };
  constructor(public ds: DrugstoreService,) { }

  ngOnInit() {
  }

  selectBag(e){
    this.ds.selectBag(e.data);
  }

  createBag(){
    this.ds.selectBag(BagBean.fromJS({id: 0, isDeleted: false, drugList: []}));
  }


}
