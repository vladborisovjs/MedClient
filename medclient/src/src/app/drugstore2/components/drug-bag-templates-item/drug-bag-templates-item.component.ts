import {Component, OnDestroy, OnInit} from '@angular/core';
import {BagNewBean} from '../../../../../swagger/med-api.service';
import {Subscription} from 'rxjs';
import {ColDef} from 'ag-grid-community';
import {DrugstoreBagService} from '../../services/drugstore-bag.service';
import {IGridTableDataSource} from '../../../shared/grid-table/components/grid-table/grid-table.component';

@Component({
  selector: 'app-drug-bag-templates-item',
  templateUrl: './drug-bag-templates-item.component.html',
  styleUrls: ['./drug-bag-templates-item.component.scss']
})
export class DrugBagTemplatesItemComponent implements OnInit, OnDestroy {
  bagTmpItem: BagNewBean;
  sbscs: Subscription[] = [];
  colDefDrugs: ColDef[] = [
    {
      headerName: 'Наименование',
      field: 'name',
      width: 250
    },
    {
      headerName: 'Лекарственная форма',
      field: 'drugFormBeanFK.name'
    },
    {
      headerName: 'Вид лекарственного препарата',
      field: 'drugTypeBeanFK.name'
    },
    {
      headerName: 'Единица измерения',
      field: 'drugUnitBeanFK.name'
    },
    {
      headerName: 'АТХ',
      field: 'athBeanFK.name'
    },
    // {
    //   headerName: 'Количество',
    //   field: 'volume',
    //   width: 250
    // }
  ];
  colDefWares: ColDef[] = [
    {
      headerName: 'Наименование',
      field: 'name',
      width: 1000
    },
    // {
    //   headerName: 'Количество',
    //   field: 'volume',
    //   width: 250
    // }
  ];
  colDefOthers: ColDef[] = [
    {
      headerName: 'Наименование',
      field: 'name',
      width: 1000
    },
    // {
    //   headerName: 'Количество',
    //   field: 'volume',
    //   width: 250
    // }
  ];
  modes = {
    DRUGS : 'Drugs',
    WARES : 'Wares',
    OTHER : 'Other'
  };
  mode = this.modes.DRUGS;
  dataSource: IGridTableDataSource;
  constructor(private ds: DrugstoreBagService) { }

  ngOnInit() {
    console.log(this.mode);
    this.sbscs.push(
      this.ds.bagTemplateSubject.subscribe(bag => {
        this.bagTmpItem = bag;
        console.log(bag);
        this.updateDataSource();
      }),
    );
  }

  ngOnDestroy() {
    this.sbscs.forEach(s => s.unsubscribe());
  }

  updateDataSource() {
    this.dataSource = {
      get: (filter, offset, count) => {
        return this.ds[`get${this.mode}FromTemplate`](this.bagTmpItem.id, offset, count);
      }
    };
  }

  changeMode(mode) {
    console.log(mode);
    this.mode = mode;
    this.updateDataSource();
  }
}
