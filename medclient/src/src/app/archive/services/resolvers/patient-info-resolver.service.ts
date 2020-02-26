import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {ArchiveService} from '../archive.service';

@Injectable({
  providedIn: 'root'
})
export class PatientInfoResolverService {

  constructor(private arch: ArchiveService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.arch.getPatient(parseInt(route.paramMap.get('patId'), 10));
  }
}
