import {Component, Input, OnInit} from '@angular/core';
import {TransportMonitoringData} from "../../../../../../swagger/med-api.service";


@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {

  @Input() featureType: string; // 'subdivision' 'call' 'transport';


  @Input() call;
  @Input() subdivision;
  @Input() transport: TransportMonitoringData;

  constructor() {
  }

  ngOnInit() {
    console.log(this);
  }


}
