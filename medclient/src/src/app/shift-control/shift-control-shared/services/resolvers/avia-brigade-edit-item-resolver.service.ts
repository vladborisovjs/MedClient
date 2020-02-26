import { Injectable } from '@angular/core';
import {DictionaryService} from "../../../../dictionaries/services/dictionary.service";
import {ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AviaBrigadeEditItemResolverService {

  constructor(private dictService: DictionaryService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.dictService.getDictionaryItem('aviation-brigades-control', route.paramMap.get('dictItem'));
  }
}
