import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges, OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import {BrigadeContainer, RecordType} from "../../../../../swagger/med-api.service";
import {ColDef} from "ag-grid-community";
import {CallStatusPipe} from "../../../shared/med-pipes/pipes/call-status.pipe";
import {BrigadeDutyService} from "../../services/brigade-duty.service";
import {NotificationsService} from "angular2-notifications";
import {take} from "rxjs/operators";
import {LogService} from "../../../shared/logs/log.service";

@Component({
  selector: 'app-bri-info',
  templateUrl: './bri-info.component.html',
  styleUrls: ['./bri-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BriInfoComponent implements OnInit, OnChanges, OnDestroy {
  @Input() brigade: any;
  @Input() brigadeContainer: BrigadeContainer;
  @Input() callList: any[] = [];
  @Input() mode: 'online' | 'offline' | 'upcoming';

  colDef: ColDef[] = [
    {
      headerName: '№',
      field: 'number',
      width: 150
    },
    {
      headerName: 'Повод',
      field: 'reasonFK.reason',
      width: 220
    },
    {
      headerName: 'Статус',
      field: 'status',
      sortable: false,
      filter: false,
      width: 200,
      cellRenderer: (p) => {
        return this.callStatusPipe.transform(p.value)
      },
    },
  ];
  callStatusPipe = new CallStatusPipe();

  constructor(private bs: BrigadeDutyService,
              private logS: LogService,
              private cdRef: ChangeDetectorRef,
              private ns: NotificationsService) {
  }

  ngOnInit() {
    // todo: обновление вызова как в кол листе
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  ngOnDestroy() {
    this.cdRef.detach();
  }

  endDuty() {
    this.bs.endDuty(this.brigade.second[0].id).pipe(take(1)).subscribe(
      res => this.ns.success('Успешно', `Бригада ${this.brigade.first.name} завершила смену.`),
      error1 => this.ns.warn('Ошибка', 'Возможно у бригады есть незавершенные вызовы.')
    )

  }

  startDuty() {
    this.bs.startDuty(this.brigade.second[0].id).pipe(take(1)).subscribe(
      res => this.ns.success('Успешно', `Бригада ${this.brigade.first.name} выведена на линию.`),
      error1 => this.ns.error('Ошибка сервера!')
    );
  }


  sendAlarm() {
    this.bs.brigadeAlarm(this.brigade.first.id).pipe(take(1)).subscribe(
      res => this.ns.success('Успешно', `Подан сигнал тревоги бригады ${this.brigade.first.name}`),
      err => this.ns.error('Ошибка', 'Не удалось установить статус')
    );

  }

  sendOnBase() {
    this.bs.brigadeOnBase(this.brigade.first.id).pipe(take(1)).subscribe(
      res => this.ns.success('Успешно', `Бригаде ${this.brigade.first.name} установлен статус "Свободна на станции"`),
      err => this.ns.error('Ошибка', 'Не удалось установить статус')
    );
  }

  openLog() {
    this.logS.openLog(this.brigade.first.id, RecordType.BRIGADE);
  }
}
