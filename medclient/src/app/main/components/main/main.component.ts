import { Component, OnInit } from '@angular/core';
import {IMenuItem} from '../../../navigation/components/nav-bar/nav-bar.component';
import {UserService} from '../../../services/user.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(private user: UserService) { }
  menuItems: IMenuItem[] = [
    {
      label: 'Диспетчеризация',
      routerLink: '/calls',
      iconClass: 'fas fa-solar-panel'
    },
    {
      label: 'Архив',
      routerLink: '/archive',
      iconClass: 'fas fa-archive'
    },
    {
      label: 'Управление сотрудниками',
      routerLink: '/schedule',
      iconClass: 'far fa-calendar-alt'
    },
    {
      label: 'Справочники',
      routerLink: '/dictionaries',
      iconClass: 'fas fa-book'
    },
    {
      label: 'Отчеты',
      routerLink: '/reports',
      iconClass: 'fas fa-file-alt'
    },
    {
      label: 'Карта',
      routerLink: '/map',
      iconClass: 'fas fa-map-marked-alt'
    },
    {
      label: 'Аптека',
      routerLink: '/drugstore',
      iconClass: 'fas fa-medkit'
    },
    {
      label: 'Администрирование',
      routerLink: '/admin',
      iconClass: 'fas fa-cogs'
    },
  ];

  ngOnInit() {
  }

  logOut(){
    this.user.logout()
  }

}
