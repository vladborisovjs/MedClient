import {HttpEvent,HttpErrorResponse, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {Injectable} from '@angular/core';
import {catchError, switchMap, tap} from 'rxjs/operators';
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
    return next.handle(transformed).pipe(
      catchError(err => {
        if (err instanceof HttpErrorResponse && err.error instanceof Blob && err.error.type === 'application/json') {
          // https://github.com/angular/angular/issues/19888
          // When request of type Blob, the error is also in Blob instead of object of the json data
          return new Promise<any>((resolve, reject) => {
            let reader = new FileReader();
            reader.onload = (e: Event) => {
              try {
                const errmsg = JSON.parse((<any>e.target).result);
                reject(new HttpErrorResponse({
                  error: errmsg,
                  headers: err.headers,
                  status: err.status,
                  statusText: err.statusText,
                  url: err.url
                }));
              } catch (e) {
                reject(err);
              }
            };
            reader.onerror = (e) => {
              reject(err);
            };
            reader.readAsText(err.error);
          });
        }
        return throwError(err);
      }),
      tap(
        (e) => {
          if (e.type === 4) { // ответ на get, а не options
          }
        },
        (error) => {
          console.log('error',error);
          if (error.status === 401){
            this.user.redirectedUrl = this.router.url === '/auth' ? this.user.redirectedUrl : this.router.url;
            this.router.navigate(['/auth']);
          } else if(error.status === 400){
            this.ns.warn('', error.error.message);
          } else if (error.status === 403){
            this.ns.warn('Недостаточно прав', 'Обратитесь к администратору');
            // this.ns.error(error.status, error.statusText + '\n' + error.message);
          } else if (error.status === 500){
            this.ns.error('Ошибка сервера!');
          }
        },
        () => {
        }
      ),
    );
  }

}
