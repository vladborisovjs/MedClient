import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {DictionaryService} from "../../../../dictionaries/services/dictionary.service";

@Injectable({
  providedIn: 'root'
})
export class AviaBrigadeEditListResolverService {

  constructor(private dictService: DictionaryService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.dictService.getDictionaryInfo('aviation-brigades-control');
  }
}
