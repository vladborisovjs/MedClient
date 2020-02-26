import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, EventEmitter,
  Input,
  OnChanges, OnDestroy,
  OnInit, Output,
  SimpleChanges
} from '@angular/core';
import {CallBean, CardBean} from "../../../../../swagger/med-api.service";
import {CallsService} from "../../services/calls.service";
import {take} from "rxjs/operators";

@Component({
  selector: 'app-call-info',
  templateUrl: './call-info.component.html',
  styleUrls: ['./call-info.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class CallInfoComponent implements OnInit, OnChanges, OnDestroy {
  @Output() whenCollapse = new EventEmitter(); // ивент для выравнивания колонок таблицы после коллапса
  @Input() call: CallBean; // на самом деле тут только часть колбина из таблицы
  cardlist: any[];
  loading: boolean;
  timeControlValue: { minutes: number, seconds: number } = {minutes: null, seconds: null};
  collapsed: boolean = true;

  constructor(private calls: CallsService,
              private cdRef: ChangeDetectorRef,
              ) {
  }

  ngOnInit() {
    const collapsed = localStorage.getItem('call-cards-collapsed');
    this.collapsed = collapsed ? JSON.parse(collapsed) : true;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.call && !changes.call.firstChange) {
      this.loading = true;
      this.calls.getCallCardsList(changes.call.currentValue.id).pipe(take(1)).subscribe(
        cards => {
          this.loading = false;
          this.cardlist = cards.list;
          this.cdRef.detectChanges();
        }
      );
    }
    this.timeControl();
  }

  ngOnDestroy() {
    this.call = null;
    this.cdRef.detach();
  }

  timeControl() {
    if (this.call) {
      const dif = new Date().getTime() - new Date(this.call.date).getTime();
      this.timeControlValue.minutes = Math.floor(dif / (60 * 1000));
      this.timeControlValue.seconds = Math.floor((dif % (60 * 1000)) / 1000);
      this.cdRef.detectChanges();
      setTimeout(this.timeControl.bind(this), 500);
    }
  }

  changeCollapse() {
    this.collapsed = !this.collapsed;
    localStorage.setItem('call-cards-collapsed', JSON.stringify(this.collapsed));
    this.whenCollapse.emit('collapsed');
  }
}
