import {Component, OnDestroy, OnInit} from '@angular/core';
import {InfoExchangeService} from '../../services/info-exchange.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-xml-doc',
  templateUrl: './xml-doc-patient.component.html',
  styleUrls: ['./xml-doc-patient.component.scss']
})
export class XmlDocPatientComponent implements OnInit, OnDestroy {
  sbscs: Subscription[] = [];
  request: string;
  response: string;
  sending: boolean;
  constructor(private ie: InfoExchangeService, private route: ActivatedRoute, private router: Router,) { }

  ngOnInit() {
    this.sbscs.push(
      this.route.data.subscribe(
        data => { // почему бы не получать из резолвера 1 объект relatedLogFK и работать с его ключами, весто 3 разных объектов?
              this.request = data.docItem.relatedLogFK.request;
              this.response = data.docItem.relatedLogFK.response;
              this.sending = data.docItem.relatedLogFK.successfulSending;
          console.log(data);
        }
      ),
    );
  }

  ngOnDestroy() {
    this.sbscs.forEach( el => el.unsubscribe());
  }
}
