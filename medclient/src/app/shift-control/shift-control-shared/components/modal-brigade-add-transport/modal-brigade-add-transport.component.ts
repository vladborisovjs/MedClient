import {Component, Input, OnInit} from '@angular/core';
import {BrigadeShiftService} from "../../services/brigade-shift.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {BrigadePerformerScheduleBean, BrigadeTransportScheduleBean} from "../../../../../../swagger/med-api.service";
import {take} from "rxjs/operators";
import {FormControl, FormGroup} from "@angular/forms";
import {ISimpleDescription} from "../../../../shared/simple-control/services/simple-description.service";

@Component({
  selector: 'app-modal-brigade-add-transport',
  templateUrl: './modal-brigade-add-transport.component.html',
  styleUrls: ['./modal-brigade-add-transport.component.scss']
})
export class ModalBrigadeAddTransportComponent implements OnInit {
  @Input() dateFrom: Date;
  @Input() dateTo: Date;
  @Input() subdivisionId: number;
  @Input() selectedTransport: BrigadeTransportScheduleBean[];
  loading = true;
  transports: BrigadeTransportScheduleBean[];
  filteredTransports: BrigadeTransportScheduleBean[];

  form = new FormGroup({
    name: new FormControl(),
    code: new FormControl()
  });
  description: ISimpleDescription[] = [
    {
      key: 'name',
      type: 'text',
      label: 'Наименование',
      styleClass: 'col-7'
    },
    {
      key: 'code',
      type: 'text',
      label: 'Номер',
      styleClass: 'col-5'
    },
  ];

  constructor(private bss: BrigadeShiftService,
              private modalInstance: NgbActiveModal) {
  }

  ngOnInit() {
    this.bss.getAvailableTransport(this.dateFrom, this.dateTo, this.subdivisionId).pipe(take(1)).subscribe(
      res => {
        this.loading = false;
        if (this.selectedTransport) { // фильтруем если есть уже выбранные траснпорты
          this.filteredTransports = this.transports = res.filter(
            t => {
              return !this.selectedTransport.find(st => t.transport === st.transportFK.id)
            }
          );
        } else {
          this.filteredTransports = this.transports = res;
        }

      }
    );
    this.form.valueChanges.subscribe(
      filter => {
        this.filteredTransports = this.transports.filter(
          transport => {
            return !!(
              (filter.name ? transport.transportFK.name.toLocaleLowerCase().includes(filter.name.toLocaleLowerCase()) : true) &&
              (filter.code ? transport.transportFK.code.toLocaleLowerCase().includes(filter.code.toLocaleLowerCase()) : true)
            );
          }
        );
      }
    );
  }

  selectTransport(transport: BrigadeTransportScheduleBean) {
    transport.dateTo.setSeconds(0); //обрезка секунд
    transport.dateFrom.setSeconds(0); //обрезка секунд
    this.modalInstance.close(BrigadeTransportScheduleBean.fromJS(transport));
  }

  back() {
    this.modalInstance.dismiss();
  }

}
