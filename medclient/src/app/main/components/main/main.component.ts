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
      label: 'Вызовы',
      routerLink: '/calls',
    },
    // {
    //   label: 'Главная',
    //   routerLink: '/start',
    // },
    {
      label: 'Графики работы',
      routerLink: '/schedule',
    },
    {
      label: 'Справочники',
      routerLink: '/dictionaries',
    },
    {
      label: 'Отчеты',
      routerLink: '/reports',
    },
    {
      label: 'Карта',
      routerLink: '/map',
    },
    {
      label: 'Аптека',
      routerLink: '/drugstore',
    },
    {
      label: 'Администрирование',
      routerLink: '/admin',
    },
  ];

  ngOnInit() {
  }

  logOut(){
    this.user.logout()
  }

}
