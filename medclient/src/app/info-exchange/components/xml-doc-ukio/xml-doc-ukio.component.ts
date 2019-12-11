import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {UkioService} from '../../services/ukio.service';

@Component({
  selector: 'app-xml-doc-ukio',
  templateUrl: './xml-doc-ukio.component.html',
  styleUrls: ['./xml-doc-ukio.component.scss']
})
export class XmlDocUkioComponent implements OnInit {
  sbscs: Subscription[] = [];
  request: string;
  response: string;
  constructor(private ukio: UkioService, private route: ActivatedRoute, private router: Router,) { }

  ngOnInit() {
    this.sbscs.push(
      this.route.data.subscribe(
        data => {
          console.log(data.docItem.listUkioMessageBeanFK[data.docItem.listUkioMessageBeanFK.length - 1]);
          this.request = data.docItem.listUkioMessageBeanFK[data.docItem.listUkioMessageBeanFK.length - 1].xmlMessage;
          //this.response = data.docItem.response;
          console.log(data);
        }
      ),
    );
  }

  ngOnDestroy() {
    this.sbscs.forEach( el => el.unsubscribe());
  }

}
