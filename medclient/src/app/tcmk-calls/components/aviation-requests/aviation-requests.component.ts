import { Component, OnInit } from '@angular/core';
import {AviaRequestBean} from '../../../../../swagger/med-api.service';
import {AviationRequestsService} from '../../services/aviation-requests.service';

@Component({
  selector: 'app-aviation-requests',
  templateUrl: './aviation-requests.component.html',
  styleUrls: ['./aviation-requests.component.scss']
})
export class AviationRequestsComponent implements OnInit {
requestsList: AviaRequestBean[];
  constructor(private  rs: AviationRequestsService) { }

  ngOnInit() {
    this.rs.getRequestsList().subscribe(
      res=> {
        this.requestsList = res.list;
      }
    );
  }

}
