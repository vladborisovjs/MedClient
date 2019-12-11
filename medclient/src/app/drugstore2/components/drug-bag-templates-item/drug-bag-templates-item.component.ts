import {Component, OnDestroy, OnInit} from '@angular/core';
import {BagNewBean, BagTemplateBean, DrugBean} from '../../../../../swagger/med-api.service';
import {Subscription} from 'rxjs';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {FormGroup} from '@angular/forms';
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
  descriptions: ISimpleDescription[] = [
    {
      label: 'Наименование:',
      key: 'name',
      type: 'text',
      styleClass: 'col-5',
      additional: {
        block: 'general'
      }
    },
  ];
  form: FormGroup;
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
  selectedDrug: DrugBean;
  selectedItem: any;
  modes = {
    DRUGS : 'DRUGS',
    WARES : 'WARES',
    OTHER : 'OTHER'
  };
  mode = this.modes.DRUGS;
  constructor(private ds: DrugstoreBagService,
              private sds: SimpleDescriptionService) { }

  ngOnInit() {
    this.form = this.sds.makeForm(this.descriptions);
    this.sbscs.push(
      this.ds.bagTemplateSubject.subscribe(bag => {
        this.bagTmpItem = bag;
        console.log(bag);
        this.form && this.form.reset(this.bagTmpItem ? this.bagTmpItem : {});
      }),
    );
  }

  ngOnDestroy() {
    this.sbscs.forEach(s => s.unsubscribe());
  }

  selectDrugFromTable(e) {
    this.selectedDrug = e.data;
  }

  changeMode(mode) {
    console.log(mode);
    this.selectedItem = null;
    this.mode = mode;
  }
}
