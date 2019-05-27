import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-f110',
  templateUrl: './f110.component.html',
  styleUrls: ['./f110.component.scss']
})
export class F110Component implements OnInit {
  sbscs: Subscription[] = [];

  constructor(private route: ActivatedRoute,) {
  }

  ngOnInit() {
    // this.sbscs.push(
    //   this.route.data.subscribe(data => {
    //     console.log(data);
    //
    //   })
    // );
  }

}
