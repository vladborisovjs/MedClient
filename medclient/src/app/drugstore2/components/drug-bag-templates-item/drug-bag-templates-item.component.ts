import {Component, OnDestroy, OnInit} from '@angular/core';
import {BagNewBean} from '../../../../../swagger/med-api.service';
import {Subscription} from 'rxjs';
import {ColDef} from 'ag-grid-community';
import {DrugstoreBagService} from '../../services/drugstore-bag.service';

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
      field: 'drugFK.name',
      width: 250
    },
    {
      headerName: 'Лекарственная форма',
      field: 'drugFK.drugFormBeanFK.name'
    },
    {
      headerName: 'Вид лекарственного препарата',
      field: 'drugFK.drugTypeBeanFK.name'
    },
    {
      headerName: 'Единица измерения',
      field: 'drugFK.drugUnitBeanFK.name'
    },
    {
      headerName: 'АТХ',
      field: 'drugFK.athBeanFK.name'
    },
    {
      headerName: 'Количество',
      field: 'volume',
      width: 250
    }
  ];
  colDefWares: ColDef[] = [
    {
      headerName: 'Наименование',
      field: 'wareFK.name',
      width: 1000
    },
    {
      headerName: 'Количество',
      field: 'volume',
      width: 250
    }
  ];
  colDefOthers: ColDef[] = [
    {
      headerName: 'Наименование',
      field: 'otherFK.name',
      width: 1000
    },
    {
      headerName: 'Количество',
      field: 'volume',
      width: 250
    }
  ];
  modes = {
    DRUGS : 'DRUGS',
    WARES : 'WARES',
    OTHER : 'OTHER'
  };
  mode = this.modes.DRUGS;
  constructor(private ds: DrugstoreBagService) { }

  ngOnInit() {
    this.sbscs.push(
      this.ds.bagTemplateSubject.subscribe(bag => {
        this.bagTmpItem = bag;
        console.log(bag);
      }),
    );
  }

  ngOnDestroy() {
    this.sbscs.forEach(s => s.unsubscribe());
  }

  changeMode(mode) {
    console.log(mode);
    this.mode = mode;
  }
}
