import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {UserService} from "../../../services/user.service";
import {ISimpleDescription} from "../../../shared/simple-control/services/simple-description.service";
import {CallStatusList, SubdivisionBean} from "../../../../../swagger/med-api.service";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {CallsService} from "../../services/calls.service";
import {take} from "rxjs/operators";
import {SocketTopicsService} from "../../../shared/socket-topic/services/socket-topics.service";
import {Hotkey, HotkeysService} from "angular2-hotkeys";

export interface ICallsTableFilter {
  subdivisionFK: SubdivisionBean;
  statuses: any[];
}

@Component({
  selector: 'app-calls-container',
  templateUrl: './calls-container.component.html',
  styleUrls: ['./calls-container.component.scss']
})
export class CallsContainerComponent implements OnInit, OnDestroy {

  filterForm = new FormGroup({
    subdivisionFK: new FormControl()
  });
  filterDescription: ISimpleDescription[] = [
    {
      placeholder: 'Район',
      key: 'subdivisionFK',
      type: 'dict',
      dict: 'getDistrictListUsingGET',
      bindLabel: 'shortName',
      shortDict: true,
      dictFilters: {rootId: [this.user.mePerformer.performer.subdivisionFK.id]},
      dictFiltersOrder: ['rootId'],
      styleClass: 'col-12'
    }
  ];
  filters: ICallsTableFilter = {
    subdivisionFK: this.user.mePerformer.performer.subdivisionFK,
    statuses: [
      CallStatusList.UNDONE,
      CallStatusList.CONFIRM,
      CallStatusList.ACTIVE,
      CallStatusList.UNCONFIRM,
      CallStatusList.TRANSPORTING,
      CallStatusList.EVACUATION_REQUIRED
    ],
  };
  sbsc: Subscription[] = [];
  callStatusList = CallStatusList;
  mode: 'calls' | 'cards' = 'calls';
  statusCounters: any;

  selectedStatuses: any = {
    "UNDONE" : true,
    "UNCONFIRM" : true,
    "CONFIRM" : true,
    "ACTIVE" : true,
    "DONE" : true,
    "EVACUATION_REQUIRED" : true,
    "TRANSPORTING" : true,
  };

  hotkeys: Hotkey[] = [
    new Hotkey('shift+n', () => {
      this.newCall();
      return false;
    }),
    new Hotkey('shift+c', () => {
      this.changeMode();
      return false;
    }),
    new Hotkey('shift+a', () => {
      this.goToCallArchive();
      return false;
    }),
    new Hotkey('shift+f', () => {
      this.goToCardArchive();
      return false;
    })
  ];


  constructor(private user: UserService,
              private cs: CallsService,
              private router: Router,
              private hotkeysService: HotkeysService,
              private sTopics: SocketTopicsService,
              private route: ActivatedRoute) {
    this.hotkeys.forEach(key => this.hotkeysService.add(key));
  }

  ngOnInit() {
    this.countStatuses();
    this.filterForm.reset({subdivisionFK: this.user.mePerformer.performer.subdivisionFK}, {emitEvent: false});
    this.sbsc.push(
      this.filterForm.valueChanges.subscribe(
        (filters: ICallsTableFilter) => {
          this.filters.subdivisionFK = filters.subdivisionFK || this.user.mePerformer.performer.subdivisionFK;

          this.updateFilter();
          this.countStatuses();
        }
      ),
      this.sTopics.callUpdatedSub.subscribe(
        s => this.countStatuses()
      ),
      this.sTopics.callStatusSub.subscribe(
        s => this.countStatuses()
      ),
    );
  }

  ngOnDestroy() {
    this.sbsc.forEach(s => s.unsubscribe());
  }

  updateFilter() {
    this.filters = Object.assign({}, this.filters);
  }

  changeMode() {
    this.mode === 'calls' ? this.mode = 'cards' : this.mode = 'calls';
  }

  goToCallArchive() {
    this.router.navigate(['archive/calls']);
  }

  goToCardArchive() {
    this.router.navigate(['archive/f110']);
  }

  countStatuses() {
    this.cs.countCalls(this.filters.subdivisionFK ? this.filters.subdivisionFK.id : undefined).pipe(take(1)).subscribe(
      cs => {
        this.statusCounters = {};
        cs.forEach(
          s => {
            switch (s.status) {
              case 0:
                this.statusCounters[CallStatusList.UNDONE] = s.count;
                break;
              case 1:
                this.statusCounters[CallStatusList.UNCONFIRM] = s.count;
                break;
              case 2:
                this.statusCounters[CallStatusList.CONFIRM] = s.count;
                break;
              case 3:
                this.statusCounters[CallStatusList.ACTIVE] = s.count;
                break;
              case 4:
                this.statusCounters[CallStatusList.DONE] = s.count;
                break;
              case 5:
                this.statusCounters[CallStatusList.EVACUATION_REQUIRED] = s.count;
                break;
              case 6:
                this.statusCounters[CallStatusList.TRANSPORTING] = s.count;
                break;
            }
          }
        );
        console.log(this.statusCounters);
      }
    );
  }

  newCall() {
    this.router.navigate(['new-call'], {relativeTo: this.route});
  }

  clickStatus(statuses) {
    for (const ss in this.selectedStatuses) {
      if (this.selectedStatuses.hasOwnProperty(ss)) {
        this.selectedStatuses[ss] = false;
      }
    }
    statuses.forEach(
      s => {
        console.log(s, this.selectedStatuses[s]);
        this.selectedStatuses[s] = true;
        console.log(s, this.selectedStatuses[s]);
      }
    );
  }
}
