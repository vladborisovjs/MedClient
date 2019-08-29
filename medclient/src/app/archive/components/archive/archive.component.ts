import { Component, OnInit } from '@angular/core';
import {ICardMenuItem} from '../../../navigation/components/card-menu/card-menu.component';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss']
})
export class ArchiveComponent implements OnInit {
  cardMenuItems: ICardMenuItem[] = [
    {
      label: 'Вызовы',
      routerLink: 'calls',
      iconClass: 'fas fa-phone-square'
    },
    {
      label: 'Карты Ф-110',
      routerLink: 'f110',
      iconClass: 'fas fa-notes-medical'
    },
    {
      label: 'Пациенты',
      routerLink: 'patients',
      iconClass: 'fas fa-user-injured'
    },

  ];
  constructor() { }

  ngOnInit() {
  }

}
