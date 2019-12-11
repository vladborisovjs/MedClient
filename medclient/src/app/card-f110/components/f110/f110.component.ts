import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {CustomModalService} from '../../../shared/modal/services/custom-modal.service';
import {CardItemService} from '../../services/card-item.service';
import {Hotkey, HotkeysService} from 'angular2-hotkeys';
import {RoleAccessService} from "../../../services/role-access.service";
import {CardBean, Status} from "../../../../../swagger/med-api.service";
import {NotificationsService} from "angular2-notifications";


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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cmodal: CustomModalService,
    private cas: CardItemService,
    private hotkeysService: HotkeysService,
    public access: RoleAccessService,
    private ns: NotificationsService,
  ) {
    this.hotkeys.forEach(key => this.hotkeysService.add(key));
  }

  ngOnInit() {
    this.cas.isEditingSub.subscribe(s => this.isEditing = s); // todo: unsubscribe
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
    this.cas.setCardStatus(status).subscribe(
      res => {
        this.ns.success('Статус карты обновлен');
      },
      error => {
        console.log(error);
        this.ns.error('Ошибка обновления статуса');
      }
    );
  }


}
