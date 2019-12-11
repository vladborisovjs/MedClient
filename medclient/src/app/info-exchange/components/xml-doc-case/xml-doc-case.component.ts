import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {InfoExchangeService} from '../../services/info-exchange.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-xml-doc-case',
  templateUrl: './xml-doc-case.component.html',
  styleUrls: ['./xml-doc-case.component.scss']
})
export class XmlDocCaseComponent implements OnInit, OnDestroy {
  sbscs: Subscription[] = [];
  request: string;
  response: string;
  sending: boolean;
  constructor(private ie: InfoExchangeService, private route: ActivatedRoute, private router: Router,) { }

  ngOnInit() {
    this.sbscs.push(
      this.route.data.subscribe(
        data => {
          this.request = data.docItem.request;
          this.response = data.docItem.response;
          this.sending = data.docItem.successfulSending;
          console.log(data);
        }
      ),
    );
  }

  ngOnDestroy() {
    this.sbscs.forEach( el => el.unsubscribe());
  }
}
