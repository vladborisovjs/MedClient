import { Injectable } from '@angular/core';
import {MedApi, Mode3} from '../../../../swagger/med-api.service';

@Injectable({
  providedIn: 'root'
})
export class CallsService {

  constructor(private api: MedApi) {
  }

  getCallsList() {
    return this.api.readAllUsingGET_6(120, Mode3.ALL);
  }
}
