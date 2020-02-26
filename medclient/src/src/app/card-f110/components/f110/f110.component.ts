import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {CustomModalService} from '../../../shared/modal/services/custom-modal.service';
import {CardItemService} from '../../services/card-item.service';
import {Hotkey, HotkeysService} from 'angular2-hotkeys';
import {RoleAccessService} from "../../../services/role-access.service";
import {CardBean, Status} from "../../../../../swagger/med-api.service";
import {NotificationsService} from "angular2-notifications";
import {ModalCardValidWarnComponent} from "../modal-card-valid-warn/modal-card-valid-warn.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {_AccessLevels, _Roles} from "../../../models/user-roles";


@Component({
  selector: 'app-f110',
  templateUrl: './f110.component.html',
  styleUrls: ['./f110.component.scss'],
  providers: [],
})
export class F110Component implements OnInit, OnDestroy {
  sbscs: Subscription[] = [];
  hotkeys: Hotkey[] = [
    new Hotkey('alt+1', () => {
      this.router.navigate(['side-one'], {relativeTo: this.route});
      return false;
    }),
    new Hotkey('alt+2', () => {
      this.router.navigate(['patient'], {relativeTo: this.route});
      return false;
    }),
    new Hotkey('alt+3', () => {
      this.router.navigate(['anamnesis'], {relativeTo: this.route});
      return false;
    }),
    new Hotkey('alt+4', () => {
      this.router.navigate(['side-two'], {relativeTo: this.route});
      return false;
    }),
    new Hotkey('alt+5', () => {
      console.log(this.router.url);
      this.router.navigate(['result'], {relativeTo: this.route});
      return false;
    }),
    new Hotkey('shift+s', () => {
      this.cas.saveCard();
      return false;
    }),
  ];
  isEditing: 'disable' | 'editing' | 'loading';
  cardStatuses = Status;
  cardItem: CardBean;
  Roles = _Roles;
  ALevels = _AccessLevels;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cmodal: CustomModalService,
    private cas: CardItemService,
    private hotkeysService: HotkeysService,
    public access: RoleAccessService,
    private modal: NgbModal,
    private ns: NotificationsService,
  ) {
    this.hotkeys.forEach(key => this.hotkeysService.add(key));
  }

  ngOnInit() {
    this.cas.isEditingSub.subscribe(s => this.isEditing = s);
    this.cas.cardItemSub.subscribe(c => this.cardItem = c);
  }

  ngOnDestroy() {
    this.sbscs.forEach(el => el.unsubscribe());
    this.cas.lockCard();
  }

  saveCard() {
    this.cas.saveCard();
  }

  unlockCard() {
    this.cas.unlockCard();
  }

  printReport(type: string) {
    this.cas.printReport(type);
  }

  sendCardStatus(status: Status) {
    if (this.cas.validateCardInfo(status)) {
      this.cas.sendCardStatus(status);
    } else {
      const vc = this.modal.open(ModalCardValidWarnComponent);
      vc.componentInstance.cardItem = this.cardItem;
      vc.componentInstance.status = status;
      vc.result.then(
        (res) => {
          if (res && res.type === 'submit') {
            this.cas.sendCardStatus(status);
          } else if (res && res.type === "navigate") {
            console.log(this.router);
            this.router.navigate([`${res.val}`], {relativeTo: this.route});
          }
        },
        () => {
        }
      );
    }

  }

  checkCardForClosing() {
    let availableResults = [
      445315,
      445324,
      445309,
      // 337742,
      // 337741,
      // 337747,
      445329,
      892993];
    return this.cardItem && this.cardItem.resultTypeFK &&
      availableResults.some(r => r === this.cardItem.resultTypeFK.id);
  }
}
