import { Component, OnInit } from '@angular/core';
import {ICardMenuItem} from '../../../navigation/components/card-menu/card-menu.component';

@Component({
  selector: 'app-drugstore',
  templateUrl: './drugstore.component.html',
  styleUrls: ['./drugstore.component.scss']
})
export class DrugstoreComponent implements OnInit {
  cardMenuItems: ICardMenuItem[] = [
    {
      label: 'Укладки',
      routerLink: 'bags',
      iconClass: 'fas fa-briefcase-medical'
    },
    {
      label: 'Шаблоны укладок',
      routerLink: 'bags-templates',
      iconClass: 'fas fa-first-aid'
    },
    {
      label: 'Заявки',
      routerLink: 'requests',
      iconClass: 'fas fa-tasks'
    },
    {
      label: 'Движение медсредств',
      routerLink: 'movements',
      iconClass: 'fas fa-random'
    },
  ];

  constructor() { }

  ngOnInit() {
  }

}
