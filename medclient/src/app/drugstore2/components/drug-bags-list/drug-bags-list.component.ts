import {Component, OnInit} from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {DrugstoreBagService} from '../../services/drugstore-bag.service';
import {BagNewBean} from '../../../../../swagger/med-api.service';

@Component({
  selector: 'app-drug-bags-list',
  templateUrl: './drug-bags-list.component.html',
  styleUrls: ['./drug-bags-list.component.scss']
})
export class DrugBagsListComponent implements OnInit {
  colDefTmp: ColDef[] = [
    {
      headerName: 'Наименование',
      field: 'name',
    },
    {
      headerName: 'Бригада',
      field: 'brigadeBeanFK.name',
    },
  ];
  filters: any = {
    deleted: false,
  };
  constructor(public ds: DrugstoreBagService,) { }

  ngOnInit() {
  }

  selectBagFromTable(e){
    this.ds.selectBag(e.data);
  }

  createNewBag(){
    this.ds.selectBag(BagNewBean.fromJS({id: 0}));
  }


}
