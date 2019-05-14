import { Injectable } from '@angular/core';
import {MedApi, Mode3} from '../../../../swagger/med-api.service';
import {UserService} from '../../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class CallsService {

  constructor(private api: MedApi, private user: UserService) {
  }

  getCallsList() {
    return this.api.readAllUsingGET_6(this.user.subdivisionId, Mode3.ALL);
  }
}
