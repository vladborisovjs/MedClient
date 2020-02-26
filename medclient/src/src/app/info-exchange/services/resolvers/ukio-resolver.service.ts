import { Injectable } from '@angular/core';
import {UkioService} from '../ukio.service';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UkioResolverService {

  constructor(private ukio: UkioService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.ukio.getUkio(parseInt(route.paramMap.get('ukioId'), 10));
  }
}
