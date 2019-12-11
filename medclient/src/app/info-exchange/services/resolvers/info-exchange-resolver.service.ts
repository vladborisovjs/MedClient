import { Injectable } from '@angular/core';
import {InfoExchangeService} from '../info-exchange.service';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InfoExchangeResolverService {

  constructor(private ie: InfoExchangeService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.ie.getLog(parseInt(route.paramMap.get('docId'), 10));
  }
}
