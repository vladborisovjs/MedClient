import { Injectable } from '@angular/core';
import {CallStatusList, MedApi} from '../../../../swagger/med-api.service';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class BigMapInfoService {

  callsListSub: BehaviorSubject<any> = new BehaviorSubject(null);
  subdivisionsListSub: BehaviorSubject<any> = new BehaviorSubject(null);
  constructor(private api: MedApi) { }

  getCallsList(){
    this.api.getCallListUsingGET(
      0,
      777,
      'date',
      undefined,
      [CallStatusList.UNDONE, CallStatusList.ACTIVE, CallStatusList.CONFIRM, CallStatusList.UNCONFIRM, CallStatusList.UNFOUNDED]
    ).subscribe(
      calls => {
        this.callsListSub.next(calls);
      }
    );
  }

  gutSubDivisionsList(){
    this.api.getSubdivisionListUsingGET(0, 777, false).subscribe(
      subs => this.subdivisionsListSub.next(subs)
    )
  }
}
