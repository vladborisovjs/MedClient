import { Injectable } from '@angular/core';
import {ArmBrigadeService} from '../arm-brigade.service';
import {Observable} from 'rxjs';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {CallsService} from '../../../calls/services/calls.service';
import {CallItemService} from '../../../calls/services/call-item.service';

@Injectable({
  providedIn: 'root'
})
export class ArmBrigadeCallItemResolverService {

  constructor(private cs: CallItemService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.cs.getCall(parseInt(route.paramMap.get('callId'), 10));
  }
}
