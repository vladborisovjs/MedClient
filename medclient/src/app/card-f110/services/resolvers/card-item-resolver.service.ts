import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {CardItemService} from '../card-item.service';
import {CallItemService} from '../../../calls/services/call-item.service';
import {tap} from 'rxjs/operators';

@Injectable()
export class CardItemResolverService {

  constructor(private cas: CardItemService, private cs: CallItemService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {


    if (route.routeConfig.path === ':cardId') {
      return this.cas.getCard(parseInt(route.paramMap.get('cardId'), 10));
    }

    return {};
  }
}
