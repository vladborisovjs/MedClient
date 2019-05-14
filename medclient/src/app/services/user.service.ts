import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_BASE_URL, MedApi} from '../../../swagger/med-api.service';
import {Router} from '@angular/router';
import {map, tap} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  authSub: Subject<boolean>;
  subdivisionId: number;

  constructor(private http: HttpClient,
              private router: Router,
              private api: MedApi,
              @Inject(API_BASE_URL) private apiUrl?: string,
  ) {
    this.authSub = new Subject<boolean>();
  }

  login(loginPair) {
    this.api.loginUsingPOST(loginPair).subscribe(
      login => {
        this.initUser(login);
        this.router.navigate(['/']);
      }
    );
  }

  initUser(user) {
    this.subdivisionId = user.subdivisionId;
    this.authSub.next(true);
  }

  checkAuth(): Observable<boolean> | Promise<boolean> | boolean {
    this.api.loginUsingGET().subscribe(
      login => {
        this.initUser(login);
      },
      err => {
        this.router.navigate(['/auth']);
      },
    );
    return this.authSub;
  }

  logout(){
    this.api.logoutUsingGET().subscribe(
      (res) => {
        this.authSub.next(false);
        this.router.navigate(['/auth']);
      }
    );

  }

}
