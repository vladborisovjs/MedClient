import { Injectable } from '@angular/core';
import {CallItemService} from '../../../calls/services/call-item.service';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AviationCallItemResolverService {
  constructor(private cs: CallItemService) {
    console.log('aviation resolver');
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.cs.getCall(parseInt(route.paramMap.get('callId'), 10));
  }
}
