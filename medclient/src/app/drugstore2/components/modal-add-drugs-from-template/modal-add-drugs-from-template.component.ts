import {Component, Input, OnInit} from '@angular/core';
import {DrugstoreBagService} from '../../services/drugstore-bag.service';
import {BagTemplateBean} from '../../../../../swagger/med-api.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ColDef} from 'ag-grid-community';

@Component({
  selector: 'app-modal-add-drugs-from-template',
  templateUrl: './modal-add-drugs-from-template.component.html',
  styleUrls: ['./modal-add-drugs-from-template.component.scss']
})
export class ModalAddDrugsFromTemplateComponent implements OnInit {
  colDefTemplates: ColDef[] = [
    {
      headerName: 'Наименование',
      field: 'name',
    },
  ];
  filters: any = {
    deleted: false,
  };
  selectedTemplateFromTable: BagTemplateBean;
  constructor(public ds: DrugstoreBagService, private modalInstance: NgbActiveModal,) { }

  ngOnInit() {
  }

  selectTemplateFromTable(e){
    console.log(e.data);
    this.selectedTemplateFromTable = e.data;
  }

  fillUpBag() {
    console.log(this.selectedTemplateFromTable);
    this.modalInstance.close(this.selectedTemplateFromTable);
  }

  back(){
    this.modalInstance.dismiss();
  }
}
