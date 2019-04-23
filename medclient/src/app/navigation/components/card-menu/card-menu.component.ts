import {Component, Input, OnInit} from '@angular/core';

export class ICardMenuItem {
  label: string;
  routerLink?;
  iconClass: string;
}

@Component({
  selector: 'app-card-menu',
  templateUrl: './card-menu.component.html',
  styleUrls: ['./card-menu.component.scss']
})
export class CardMenuComponent implements OnInit {
  @Input() items: ICardMenuItem[];
  constructor() { }

  ngOnInit() {
  }

}
