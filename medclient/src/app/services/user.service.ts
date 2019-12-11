import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_BASE_URL, MedApi, PerformerContainer} from '../../../swagger/med-api.service';
import {Router} from '@angular/router';
import {map, tap} from 'rxjs/operators';
import {Observable, of, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  authSub: Subject<boolean>;
  token: string; //WebSocket  token
  mePerformer: PerformerContainer;
  redirectedUrl: any;
  constructor(private http: HttpClient,
              private router: Router,
              private api: MedApi,
              @Inject(API_BASE_URL) private apiUrl?: string,
  ) {
    this.authSub = new Subject<boolean>();
  }

  login(loginPair) {
    return this.api.loginUsingPOST(loginPair).pipe(tap(
      login => {
        this.authSub.next(true);
        if (this.redirectedUrl){
          this.router.navigate([this.redirectedUrl]);
        }  else {
          this.router.navigate(['/']);
        }
      }
    ));
  }

  initUser(user: PerformerContainer) {
    this.mePerformer = user;
    console.log('Hello ', user);
    this.authSub.next(true);
  }

  checkAuth(): Observable<boolean> | Promise<boolean> | boolean {
    this.api.getPerformerByMeUsingGET().subscribe(
      user => {
        this.initUser(user);
      },
      err => {
        this.router.navigate(['/auth']);
      },
    );
    return this.authSub;
  }

  // getMeWithBrigade() {
  //   return this.api.getPerformerByMeWithBrigadeUsingGET().pipe(tap(
  //     user => this.initUser(user)
  //   ));
  // }

  checkAssignedBrigade(): Observable<boolean>{
    if (this.mePerformer.brigadeBean){
      return of(true)
    }
    return this.api.getPerformerByMeWithBrigadeUsingGET().pipe(map(
      user => {
        this.mePerformer.brigadeBean = user.brigadeBean;
        this.mePerformer.brigadeSchedule = user.brigadeSchedule;
        return !!this.mePerformer.brigadeBean
      }
    ))
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
