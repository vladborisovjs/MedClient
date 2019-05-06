import { Injectable } from '@angular/core';
import {CallItemService} from '../call-item.service';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CallItemResolverService {

  constructor(private cs: CallItemService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.cs.getCall(parseInt(route.paramMap.get('id'), 10));
  }
}

