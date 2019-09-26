import { Injectable } from '@angular/core';
import {MedApi} from '../../../../swagger/med-api.service';

@Injectable({
  providedIn: 'root'
})
export class AviationRequestsService {

  constructor(private api: MedApi) { }

  getRequestsList(){
    return this.api.getAviaRequestListUsingGET()
  }
}
