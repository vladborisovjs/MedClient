import {Component, OnInit} from '@angular/core';
import {MedApi} from '../../../../../swagger/med-api.service';
import {HttpClient} from '@angular/common/http';


@Component({
  selector: 'app-calls',
  templateUrl: './calls.component.html',
  styleUrls: ['./calls.component.scss']
})
export class CallsComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit() {

  }
}
