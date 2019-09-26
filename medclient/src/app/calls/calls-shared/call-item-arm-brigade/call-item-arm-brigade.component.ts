import { Component, OnInit } from '@angular/core';
import {ModalCallBrigadeStatusesComponent} from '../modal-call-brigade-statuses/modal-call-brigade-statuses.component';
import {CallContainer} from '../../../../../swagger/med-api.service';
import {Subscription} from 'rxjs';
import {DatePipe} from '@angular/common';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CustomModalService} from '../../../shared/modal/services/custom-modal.service';
import {NotificationsService} from 'angular2-notifications';
import {ActivatedRoute, Router} from '@angular/router';
import {ColDef} from 'ag-grid-community';
import {CallItemService} from '../../services/call-item.service';

@Component({
  selector: 'app-call-item-arm-brigade',
  templateUrl: './call-item-arm-brigade.component.html',
  styleUrls: ['./call-item-arm-brigade.component.scss']
})
export class CallItemArmBrigadeComponent implements OnInit {
  callContainer: CallContainer;
  sbscs: Subscription[] = [];
  colDefs: ColDef[] = [
    {
      headerName: '№',
      field: 'id',
      sortable: true,
      filter: true,
      width: 80
    },
    {
      headerName: 'Дата',
      field: 'date',
      valueFormatter: (p) => this.datePipe.transform(p.value, 'dd.MM.yyyy HH:mm'),
      sortable: true,
      filter: true,
      width: 600
    }
  ];
  datePipe = new DatePipe('ru');
  listSource = [];
  constructor(private modal: NgbModal,
              private cmodal: CustomModalService,
              private ns: NotificationsService,
              private router: Router,
              private cs: CallItemService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    console.log(this.cs.callItemSub.value);
    this.sbscs.push(
      this.cs.callItemSub.subscribe(
        call => {
          this.callContainer = call;
          console.log(call);
        }
      ),
      this.cs.getBrigadesCards(this.callContainer.brigadeList[0].brigade.id, this.callContainer.call.id).subscribe(
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

  openBriStatuses(brigade) {
    const briStatuses = this.modal.open(ModalCallBrigadeStatusesComponent);
    briStatuses.componentInstance.brigade = brigade;
    briStatuses.componentInstance.call = this.callContainer.call;
  }

  createCard() {
    this.sbscs.push(
      this.cs.createCallCard(this.callContainer.brigadeList[0].brigade, this.callContainer.call.id).subscribe(
        card => {
          this.ns.success('Успешно', 'Создана Ф-110');
          this.router.navigate([`${this.router.url}/card/${card.id}`], {relativeTo: this.route});
        }
      )
    );
  }

  goToCard(card) {
    this.router.navigate([`${this.router.url}/card/${card.data.id}`], {relativeTo: this.route});
  }
}
