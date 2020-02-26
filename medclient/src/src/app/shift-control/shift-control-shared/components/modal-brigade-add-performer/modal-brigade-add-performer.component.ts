import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {ISimpleDescription} from "../../../../shared/simple-control/services/simple-description.service";
import {BrigadeShiftService} from "../../services/brigade-shift.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {BrigadePerformerScheduleBean} from "../../../../../../swagger/med-api.service";

@Component({
  selector: 'app-modal-brigade-add-performer',
  templateUrl: './modal-brigade-add-performer.component.html',
  styleUrls: ['./modal-brigade-add-performer.component.scss']
})
export class ModalBrigadeAddPerformerComponent implements OnInit {
  @Input() dateFrom: Date;
  @Input() dateTo: Date;
  @Input() subdivisionId: number;
  @Input() selectedPerformers: BrigadePerformerScheduleBean[];
  loading = true;

  form: FormGroup = new FormGroup(
    {
      type: new FormControl(this.bss.mode === 'aviation' ? 4 : 0)
    }
  );

  descriptions: ISimpleDescription[] = [
    {
      label: 'Группа: ',
      key: 'type',
      type: 'select',
      selectList:
        this.bss.mode === 'aviation' ?
          [
            {name: 'Мед. работники авиабригад', id: 4},
            {name: 'Пилоты авиабригад', id: 3},
            {name: 'Прочий персонал бригад', id: 5},
          ]:
          [
            {name: 'Мед. работники бригад', id: 0},
            {name: 'Водители бригад', id: 1},
            {name: 'Прочий персонал бригад', id: 5},

          ],
      styleClass: 'line-form col-12'
    },
  ];
  performers: BrigadePerformerScheduleBean[];

  constructor(private bss: BrigadeShiftService,
              private modalInstance: NgbActiveModal) {
  }

  ngOnInit() {
    this.form.valueChanges.subscribe(
      ch => {
        if (ch.type !== null) {
          console.log(this.form, ch);
          this.performers = null;
          this.loading = true;
          this.bss.getAvailablePerformers(this.dateFrom, this.dateTo, ch.type, this.subdivisionId).subscribe(
            res => {
              this.loading = false;
              if (this.selectedPerformers) {  // фильтруем если есть уже выбранные сострудники
                this.performers = res.filter(
                  p => {
                    return -1 === this.selectedPerformers.findIndex(sp => p.performerFK.id === sp.performerFK.id);
                  }
                );
              } else {
                this.performers = res;
              }

            }
          );
        }
      }
    );
    this.form.reset({type: this.bss.mode === 'aviation' ? 4 : 0})
  }

  selectPerformer(performer: BrigadePerformerScheduleBean) {
    performer.dateTo.setSeconds(0); //обрезка секунд
    performer.dateFrom.setSeconds(0); //обрезка секунд
    this.modalInstance.close(BrigadePerformerScheduleBean.fromJS(performer));
  }

  back() {
    this.modalInstance.dismiss();
  }

}
