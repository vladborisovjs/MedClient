import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {DrugstoreBagService} from '../../services/drugstore-bag.service';
import {BagTemplateBean} from '../../../../../swagger/med-api.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ColDef} from 'ag-grid-community';
import {Subscription} from 'rxjs';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-modal-add-drugs-from-template',
  templateUrl: './modal-add-drugs-from-template.component.html',
  styleUrls: ['./modal-add-drugs-from-template.component.scss']
})
export class ModalAddDrugsFromTemplateComponent implements OnInit, OnDestroy {
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
  template: any[] = [];
  sbscs: Subscription[] = [];
  constructor(public ds: DrugstoreBagService, private modalInstance: NgbActiveModal) { }

  ngOnInit() {
  }

  selectTemplateFromTable(e) {
    console.log(e.data);
    this.selectedTemplateFromTable = e.data.id;
    const mode = ['Drugs', 'Wares', 'Other'];
    for (let i = 0; i < mode.length; i++) {
        this.ds[`get${mode[i]}FromTemplate`](this.selectedTemplateFromTable).pipe(take(1)).subscribe(
          ids => {
            this.template[i] = ids.list.map((el) => {
              return el.id
            });
            console.log(this.template.length);
          }
        )
    }
  }

  fillUpBag() {
    console.log(this.template);
    this.modalInstance.close(this.template);
  }

  back(){
    this.modalInstance.dismiss();
  }

  ngOnDestroy() {
    this.sbscs.forEach(el => {el.unsubscribe()})
  }
}
