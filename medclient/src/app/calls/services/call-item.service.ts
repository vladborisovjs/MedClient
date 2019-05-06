import { Injectable } from '@angular/core';
import {MedApi} from '../../../../swagger/med-api.service';

@Injectable({
  providedIn: 'root'
})
export class CallItemService {

  constructor(private api: MedApi) { }

  getCall(callId){
    return this.api.readOneUsingGET_5(120, callId);
  }
}
