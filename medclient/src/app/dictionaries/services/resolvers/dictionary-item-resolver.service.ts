import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {DictionaryService} from '../dictionary.service';

@Injectable({
  providedIn: 'root'
})
export class DictionaryItemResolverService {

  constructor(private dictService: DictionaryService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.dictService.getDictionaryItem(route.parent.paramMap.get('dictName'), route.paramMap.get('dictItem'));
  }
}
