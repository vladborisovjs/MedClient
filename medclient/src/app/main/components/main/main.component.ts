import {Component, HostListener, OnInit} from '@angular/core';
import {IMenuItem} from '../../../navigation/components/nav-bar/nav-bar.component';
import {UserService} from '../../../services/user.service';
import {_AccessLevels} from "../../../models/user-roles";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  constructor(public user: UserService) { }
  menuItems: IMenuItem[] = [
    {
      label: 'Вызовы',
      routerLink: '/calls',
      iconClass: 'fas fa-solar-panel',
      accessLevel: _AccessLevels.callsModule,
    },
    {
      label: 'ТЦМК',
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
      label: 'Управление персоналом',
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
      label: 'НСИ',
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
    // {
    //   label: 'АРМ Бригады',
    //   routerLink: '/armBrigade',
    //   iconClass: 'fas fa-desktop',
    //   accessLevel: _AccessLevels.armBrigadeModule,
    // },
  ];

  ngOnInit() {
  }

  logOut(){
    this.user.logout()
  }

}
