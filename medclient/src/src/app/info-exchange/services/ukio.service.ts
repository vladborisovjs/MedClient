import { Injectable } from '@angular/core';
import {MedApi} from '../../../../swagger/med-api.service';

@Injectable({
  providedIn: 'root'
})
export class UkioService {

  constructor(private api: MedApi) { }

  getUkioList(from, count) {
    return this.api.listUkioUsingGET(from, count);
  }

  getUkio(id) {
    return this.api.getUkioUsingGET(id);
  }
}
