import {Component, Input, OnInit} from '@angular/core';
import {DrugstoreService} from '../../services/drugstore.service';
import {BagTemplateBean} from '../../../../../swagger/med-api.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ColDef} from 'ag-grid-community';

@Component({
  selector: 'app-modal-add-drugs-from-template',
  templateUrl: './modal-add-drugs-from-template.component.html',
  styleUrls: ['./modal-add-drugs-from-template.component.scss']
})
export class ModalAddDrugsFromTemplateComponent implements OnInit {
  @Input() bagId: number;
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
  selectedTemplate: BagTemplateBean;
  constructor(public ds: DrugstoreService, private modalInstance: NgbActiveModal,) { }

  ngOnInit() {
  }

  selectTemplate(e){
    console.log(e.data);
    this.selectedTemplate = e.data;
  }

  fillBag() {
    this.ds.addDrugToBag(this.bagId, this.selectedTemplate.drugList).subscribe(
      res => {
        console.log(res);
        this.modalInstance.close(this.selectedTemplate.drugList)
      },
      error1 => {
        this.modalInstance.close(false)
      }
    );
  }

  back(){
    this.modalInstance.dismiss();
  }
}
