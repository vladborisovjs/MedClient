import { Component, OnInit } from '@angular/core';
import {IMenuItem} from '../../../navigation/components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor() { }
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
      label: 'НСИ',
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

}
