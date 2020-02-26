import {Component, Input, OnInit} from '@angular/core';

export interface IPlateInfo {
  title: string;
  field: string;
  type: string;
  datePipeFormat?: string;
  subField?: string; // для типа bean: field - имя бина, subField - поле в бине
  block?: any;
}

@Component({
  selector: 'app-info-plate',
  templateUrl: './info-plate.component.html',
  styleUrls: ['./info-plate.component.scss']
})
export class InfoPlateComponent implements OnInit {

  @Input() item: any;
  @Input() properties: IPlateInfo[];

  constructor() { }

  ngOnInit() {
  }

}
