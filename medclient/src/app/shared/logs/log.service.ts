import {Injectable} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {MedApi, RecordType} from "../../../../swagger/med-api.service";
import {ModalLogComponent} from "./modal-log/modal-log.component";
import {IGridTableDataSource} from "../grid-table/components/grid-table/grid-table.component";

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor(private modal: NgbModal, private api: MedApi) {
  }

  getLogSource(id: number, type: RecordType): IGridTableDataSource{
    return  {
      get: (filter, offset, count) => {
        return this.api.getLogListByRecordUsingGET(offset, count, id, type)
      }
    }
  }

  openLog(id: number, type: RecordType){
    const logWin = this.modal.open(ModalLogComponent, {size: 'lg'});
    logWin.componentInstance.source = this.getLogSource(id, type);
  }

}
