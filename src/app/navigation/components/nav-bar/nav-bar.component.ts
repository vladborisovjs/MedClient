import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

export class IMenuItem {
  label: string;
  routerLink?;
  items?: IMenuItem[];
}

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  isCollapsed = true;
  @Input() items: IMenuItem[];
  @Output() onExit = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
