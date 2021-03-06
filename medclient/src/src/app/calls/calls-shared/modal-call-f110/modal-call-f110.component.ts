import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ColDef} from 'ag-grid-community';
import {CallItemService} from '../../services/call-item.service';
import {NotificationsService} from 'angular2-notifications';
import {DatePipe} from '@angular/common';
import {BrigadeBean} from '../../../../../swagger/med-api.service';
import {Subscription} from 'rxjs';
import {tap} from 'rxjs/operators';
import {RoleAccessService} from "../../../services/role-access.service";
import {FullnameShorterPipe} from "../../../shared/med-pipes/pipes/fullname-shorter.pipe";

@Component({
  selector: 'app-modal-call-f110',
  templateUrl: './modal-call-f110.component.html',
  styleUrls: ['./modal-call-f110.component.scss']
})
export class ModalCallF110Component implements OnInit, OnDestroy {
  @Input() brigade: BrigadeBean;
  @Input() callId: number;
  colDefs: ColDef[] = [
    {
      headerName: '№',
      field: 'number',
      width: 180,
      sortable: false,
      filter: false,
    },
    {
      headerName: 'Дата',
      field: 'date',
      valueFormatter: (p) => this.datePipe.transform(p.value, 'dd.MM.yyyy HH:mm'),
      sortable: false,
      filter: false,
      width: 150,
    },
    {
      headerName: 'Сотрудник',
      field: 'performerFK',
      sortable: false,
      filter: false,
      width: 160,
      valueFormatter: p => this.nameShorterPipe.transform(p.value)
    },
    {
      headerName: 'Бригада',
      field: 'brigadeFK.name',
      sortable: false,
      filter: false,
      width: 200,
    },
    {
      headerName: 'Пациент',
      field: 'patientFK',
      valueFormatter: p => this.nameShorterPipe.transform(p.value),
      width: 160,
    },
    {
      headerName: 'Результат',
      field: 'resultTypeFK.name',
      sortable: false,
      filter: false,
      width: 300,
    },

  ];
  listSource = [];
  sbscs: Subscription[] = [];
  datePipe = new DatePipe('ru');
  nameShorterPipe = new FullnameShorterPipe();

  constructor(private router: Router,
              private route: ActivatedRoute,
              private ns: NotificationsService,
              private modalInstance: NgbActiveModal,
              public access: RoleAccessService,
              private cs: CallItemService,) {
  }
  loading: boolean = false;
  ngOnInit() {
    this.loading = true;
    this.sbscs.push(
      this.cs.getBrigadesCards(this.brigade.id, this.callId)
        .pipe(tap(() => this.loading = false))
        .subscribe(
        list => {
          console.log(list);
          this.listSource = list.list;
        }
      )
    );
  }

  ngOnDestroy() {
    this.sbscs.forEach(el => el.unsubscribe());
  }

  gotoCard(card = null) {
    console.log(card);
    const cardId = card ? card.data.id : 0;
    this.modalInstance.close(`card/${cardId}`)
  }

  createCard() {
    console.log(this);
    this.sbscs.push(
      this.cs.createCallCard(this.brigade, this.callId).subscribe(
        card => {
          console.log(card);
          this.ns.success('Успешно', `Создана Ф-110 № ${card.number}`);
          this.router.navigateByUrl(`calls/${this.callId}/card/${card.id}`);
          this.modalInstance.close(`card/${card.id}`)
        }
      )
    );
  }

  cancel() {
    this.modalInstance.dismiss();
  }

}
