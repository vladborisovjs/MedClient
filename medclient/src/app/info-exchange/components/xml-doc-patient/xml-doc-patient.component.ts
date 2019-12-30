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
