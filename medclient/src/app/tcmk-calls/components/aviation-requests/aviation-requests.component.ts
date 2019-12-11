import {Component, OnDestroy, OnInit} from '@angular/core';
import {AviaRequestBean, BrigadeBean, BrigadeContainer} from '../../../../../swagger/med-api.service';
import {AviationRequestsService} from '../../services/aviation-requests.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {NotificationsService} from 'angular2-notifications';

@Component({
  selector: 'app-aviation-requests',
  templateUrl: './aviation-requests.component.html',
  styleUrls: ['./aviation-requests.component.scss']
})
export class AviationRequestsComponent implements OnInit, OnDestroy {
requestsList: AviaRequestBean[];
actualBrigades: BrigadeContainer[];
sbscs: Subscription[] = [];

  constructor(private rs: AviationRequestsService,
              private router: Router,
              private ns: NotificationsService) { }

  ngOnInit() {
    this.sbscs.push(
      this.rs.getRequestsList().subscribe(
        res=> {
          this.requestsList = res.list;
        }
      ),
      this.rs.getAvailableAviaBrigades().subscribe(
        res => {
          console.log('-->',res);
          this.actualBrigades = res;
        }
      )
    );


  }

  ngOnDestroy(){
    this.sbscs.forEach(s => s.unsubscribe());
  }

  openRequests(){
    this.router.navigate(['/aviation/requests']);
  }

  sendOnBase(briId) {
    this.sbscs.push(
      this.rs.brigadeOnBase(briId).subscribe(
        (res: BrigadeBean)=>{
          console.log(res);
          this.actualBrigades[this.actualBrigades.findIndex(b => b.brigade.id === res.id)].brigade = res;
          this.ns.success('Успешно', `Бригаде установлен статус "Свободна на станции"`);
        },
        err => {
          console.log(err);
          this.ns.error('Ошибка', 'Не удалось установить статус');
        }
      )
    );
  }

}
