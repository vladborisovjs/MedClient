import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';
import {Subscription} from 'rxjs';
import {CallDto} from '../../../../../swagger/med-api.service';
import {ISimpleDescription} from '../../../shared/simple-control/services/simple-description.service';

@Component({
  selector: 'app-call-item',
  templateUrl: './call-item.component.html',
  styleUrls: ['./call-item.component.scss']
})
export class CallItemComponent implements OnInit, OnDestroy {
  id: number;
  sbscs: Subscription[] = [];
  callItem: CallDto;
  callDescription: ISimpleDescription[] = [
    //general
    {
      label: 'Номер',
      key: 'call_number',
      type: 'number',
      additional: {
        block: 'general'
      }
    },
    {
      label: 'Тип',
      key: 'call_priority_name',
      type: 'text',
      additional: {
        block: 'general'
      }
    }
  ];

  constructor(private route: ActivatedRoute,) {
  }

  ngOnInit() {
    this.sbscs.push(
      this.route.data.subscribe(data => {
        this.callItem = data.callItem;
        console.log('item', this.callItem);
      })
    );
  }

  ngOnDestroy() {
    this.sbscs.forEach(el => el.unsubscribe());
  }

  /** метод для получения описания по
   * блоку в поле аддишнл,
   * чтобы все описания хранились
   * в одном массиве
   */
  getBlockDescriptions(block: string): ISimpleDescription[] {
    return this.callDescription.filter(el => {
      if (el.additional) {
        return el.additional.block === block;
      }
      return false;
    });
  }

}
