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
  relatedLogFK: any;
  constructor(private ie: InfoExchangeService, private route: ActivatedRoute, private router: Router,) { }

  ngOnInit() {
    this.sbscs.push(
      this.route.data.subscribe(
        data => {
          this.relatedLogFK = data.docItem;
          console.log(data);
        }
      ),
    );
  }

  ngOnDestroy() {
    this.sbscs.forEach( el => el.unsubscribe());
  }
}
