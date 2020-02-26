import { Component, OnInit } from '@angular/core';
import {ModalCallBrigadeStatusesComponent} from '../modal-call-brigade-statuses/modal-call-brigade-statuses.component';
import {BrigadeBean, CallContainer} from '../../../../../swagger/med-api.service';
import {Subscription} from 'rxjs';
import {DatePipe} from '@angular/common';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CustomModalService} from '../../../shared/modal/services/custom-modal.service';
import {NotificationsService} from 'angular2-notifications';
import {ActivatedRoute, Router} from '@angular/router';
import {CallItemService} from '../../services/call-item.service';
import {ArmBrigadeService} from '../../../arm-brigade/services/arm-brigade.service';
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'app-call-item-arm-brigade',
  templateUrl: './call-item-arm-brigade.component.html',
  styleUrls: ['./call-item-arm-brigade.component.scss']
})
export class CallItemArmBrigadeComponent implements OnInit {
  callContainer: CallContainer;
  sbscs: Subscription[] = [];
  datePipe = new DatePipe('ru');
  listSource = [];
  brigadeBean: BrigadeBean;
  constructor(private modal: NgbModal,
              private cmodal: CustomModalService,
              private ns: NotificationsService,
              private arms: ArmBrigadeService,
              private router: Router,
              private user: UserService,
              private cs: CallItemService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    console.log(this.cs.callItemSub.value);
    this.brigadeBean = this.user.mePerformer.brigadeBean;
    this.sbscs.push(
      this.cs.callItemSub.subscribe(
        call => {
          this.callContainer = call;
          console.log(call);
        }
      ),
      this.cs.getBrigadesCards(this.brigadeBean.id, this.callContainer.call.id).subscribe(
        list => {
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
    briStatuses.result.then(res => {
      if (res) {
        this.cs.updateCall().subscribe(
          g => console.log(g)
        );
      }
    });
  }

  createCard() {
    this.sbscs.push(
      this.cs.createCallCard(this.brigadeBean, this.callContainer.call.id).subscribe(
        card => {
          this.ns.success('Успешно', 'Создана Ф-110');
          this.router.navigate([`${this.router.url}/card/${card.id}`], {relativeTo: this.route});
        }
      )
    );
  }
}
