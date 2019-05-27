import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {CardItemService} from '../card-item.service';
import {CallItemService} from '../call-item.service';
import {tap} from 'rxjs/operators';

@Injectable()
export class CardItemResolverService {

  constructor(private cas: CardItemService, private cs: CallItemService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {


    if (route.routeConfig.path === 'side-one') {
      return this.cas.getCartSideOne(parseInt(route.parent.paramMap.get('cardId'), 10));
    }

    if (route.routeConfig.path === 'side-two') {
      return this.cas.getCartSideTwo(parseInt(route.parent.paramMap.get('cardId'), 10));
    }

    if (route.routeConfig.path === 'patient') {
      return this.cas.getPatient(parseInt(route.parent.parent.paramMap.get('cardId'), 10));
    }

    if (route.routeConfig.path === 'anamnesis') {
      return this.cas.getAnamnesis(parseInt(route.parent.paramMap.get('cardId'), 10));
    }

    if (route.routeConfig.path === 'protocol') {
      return this.cas.getProtocol(parseInt(route.parent.paramMap.get('cardId'), 10));
    }

    if (route.routeConfig.path === 'result') {
      return this.cas.getResult(parseInt(route.parent.paramMap.get('cardId'), 10));
    }

    if (route.routeConfig.path === 'therapies') {
      return this.cas.getTherapy(parseInt(route.parent.parent.paramMap.get('cardId'), 10));
    }

    return {};
  }
}
