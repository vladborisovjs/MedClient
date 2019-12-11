import {Component, OnInit} from '@angular/core';
import {ICardMenuItem} from '../../../navigation/components/card-menu/card-menu.component';
import {_AccessLevels} from "../../../models/user-roles";

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {
  cardMenuItems: ICardMenuItem[] = [
    {
      label: 'Управление вызовами',
      routerLink: '/calls',
      iconClass: 'fas fa-solar-panel',
      accessLevel: _AccessLevels.callsModule,
    },
    {
      label: 'Управление вызовами ТЦМК',
      routerLink: '/tcmk-calls',
      iconClass: 'fas fa-meteor',
      accessLevel: _AccessLevels.tcmkModule,
    },
    {
      label: 'Авиация',
      routerLink: '/aviation',
      iconClass: 'fas fa-helicopter',
      accessLevel: _AccessLevels.aviationModule
    },
    {
      label: 'Управление персоналом СМП',
      routerLink: '/shift-control',
      iconClass: 'fas fa-calendar-day',
      accessLevel: _AccessLevels.shiftControl
    },
    {
      label: 'Карта',
      routerLink: '/map',
      iconClass: 'fas fa-map-marked-alt',
      accessLevel: _AccessLevels.mapModule
    },
    {
      label: 'Отчеты',
      routerLink: '/reports',
      iconClass: 'fas fa-file-alt',
      accessLevel: _AccessLevels.reportModule,
    },
    {
      label: 'Архив',
      routerLink: '/archive',
      iconClass: 'fas fa-archive',
      accessLevel: _AccessLevels.archiveModule,
    },
    {
      label: 'Укладки',
      routerLink: '/drugstore2',
      iconClass: 'fas fa-medkit',
      accessLevel: _AccessLevels.drugBagModule,
    },
    {
      label: 'Ведение НСИ',
      routerLink: '/dictionaries',
      iconClass: 'fas fa-book',
      accessLevel: _AccessLevels.dictModule,
    },

    {
      label: 'Администрирование',
      routerLink: '/admin',
      iconClass: 'fas fa-cogs',
      accessLevel: _AccessLevels.adminModule,
    },
    {
      label: 'Инфообмен',
      routerLink: '/info-exchange',
      iconClass: 'fas fa-exchange-alt',
      accessLevel: _AccessLevels.infoExchangeModule,
    },
    {
      label: 'АРМ Бригады',
      routerLink: '/arm-brigade',
      iconClass: 'fas fa-desktop',
      accessLevel: _AccessLevels.armBrigadeModule,
    },
  ];

  constructor() { }

  ngOnInit() {
  }

}
