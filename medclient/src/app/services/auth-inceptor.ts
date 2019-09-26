import {HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Injectable} from '@angular/core';
import {switchMap, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {UserService} from './user.service';
import {NotificationsService} from 'angular2-notifications';

@Injectable()
export class AuthInceptor implements HttpInterceptor {
  constructor(private router: Router, private user: UserService, private ns: NotificationsService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<HttpEventType.Response>> {
    const transformed = req.clone({
      withCredentials: true
    });
    return next.handle(transformed).pipe(tap(
      (e) => {
        if (e.type === 4) { // ответ на get, а не options
        }
      },
      (error) => {
        if (error.status === 401){
          this.user.redirectedUrl = this.router.url === '/auth' ? this.user.redirectedUrl : this.router.url;
          console.log(this.user.redirectedUrl);
          this.router.navigate(['/auth']);
        } else {
          console.log('error', error);
          this.ns.error(error.status, error.statusText + '\n' + error.message);
        }
      },
      () => {
      }
    ));
  }

}
