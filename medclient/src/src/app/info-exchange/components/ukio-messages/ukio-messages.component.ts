import {Component, OnDestroy, OnInit} from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {Subscription} from 'rxjs';
import {UkioService} from '../../services/ukio.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DatePipe} from '@angular/common';
import {IPlateInfo} from '../../../shared/info-plate/components/info-plate/info-plate.component';

@Component({
  selector: 'app-ukio-messages',
  templateUrl: './ukio-messages.component.html',
  styleUrls: ['./ukio-messages.component.scss']
})
export class UkioMessagesComponent implements OnInit, OnDestroy {
  datePipe = new DatePipe('ru');
  dateFormatter(params) {
    return params.value ? this.datePipe.transform(params.value, 'dd.MM.yyyy HH:mm:ss') : '-';
  }
  colDefs: ColDef[] = [
    // {
    //   headerName: 'Дата',
    //   field: 'time',
    //   valueFormatter: (p) => {
    //     return this.dateFormatter(p);
    //   },
    //   sort: 'asc',
    //   width: 100
    // },
    {
      headerName: '№ сообщения',
      field: 'id',
      width: 100
    },
    {
      headerName: 'Тип сообщения',
      field: 'messageType',
      width: 100
    }
  ];
  callId: number;
  listSource = [];
  cardStatuses = [];
  updatesUkioFrom103 = [];
  sbscs: Subscription[] = [];
  ukioMessage: IPlateInfo[] = [
    // Карта
    {
      title: 'Время вызова: ', field: 'callDateTime', type: 'text', block: 'card'
    },
    {
      title: 'Телефон (АОН) заявителя: ', field: 'cardInfoPhone', type: 'text', block: 'card'
    },
    {
      title: 'Запись разговора: ', field: 'recordURL', type: 'text', block: 'card'
    },
    // Местоположение инцидента
    {
      title: 'Адрес: ', field: 'addressName', type: 'text', block: 'incidentLocation'
    },
    // {
    //   title: 'Регион: ', field: 'regionName', type: 'text', block: 'incidentLocation'
    // },
    // {
    //   title: 'Код региона: ', field: 'regionCode', type: 'text', block: 'incidentLocation'
    // },
    {
      title: 'Улица: ', field: 'streetName', type: 'text', block: 'incidentLocation'
    },
    {
      title: 'Номер дома: ', field: 'house', type: 'text', block: 'incidentLocation'
    },
    {
      title: 'Номер владения: ', field: 'estate', type: 'text', block: 'incidentLocation'
    },
    {
      title: 'Корпус дома: ', field: 'building', type: 'text', block: 'incidentLocation'
    },
    {
      title: 'Номер этажа: ', field: 'level', type: 'text', block: 'incidentLocation'
    },
    {
      title: 'Номер подъезда: ', field: 'entrance', type: 'text', block: 'incidentLocation'
    },
    {
      title: 'Номер строения: ', field: 'construction', type: 'text', block: 'incidentLocation'
    },
    {
      title: 'Именованный объект: ', field: 'objectName', type: 'text', block: 'incidentLocation'
    },
    {
      title: 'Номер квартиры или офиса: ', field: 'room', type: 'text', block: 'incidentLocation'
    },
    {
      title: 'Подъезд: ', field: 'code', type: 'text', block: 'incidentLocation'
    },
    {
      title: 'Долгота: ', field: 'longitude', type: 'text', block: 'incidentLocation'
    },
    {
      title: 'Широта: ', field: 'latitude', type: 'text', block: 'incidentLocation'
    },
    {
      title: 'Точность координат: ', field: 'accuracy', type: 'text', block: 'incidentLocation'
    },
    {
      title: 'Название дороги: ', field: 'road', type: 'text', block: 'incidentLocation'
    },
    {
      title: 'Километр дороги: ', field: 'kilometer', type: 'text', block: 'incidentLocation'
    },
    {
      title: 'Дополнительная информация к адресу: ', field: 'additionalInfo', type: 'text', block: 'incidentLocation'
    },
    {
      title: 'Фактическое расположение: ', field: 'near', type: 'text', block: 'incidentLocation'
    },
    {
      title: 'Уточнение места происшествия: ', field: 'meter', type: 'text', block: 'incidentLocation'
    },
    // Инцидент
    {
      title: 'Описание происшествия: ', field: 'incidentDescription', type: 'text', block: 'incident'
    },
    {
      title: 'Вид происшествия: ', field: 'incidentName', type: 'text', block: 'incident'
    },
    {
      title: 'Число смертей: ', field: 'numberOfDeaths', type: 'text', block: 'incident'
    },
    {
      title: 'Раненые: ', field: 'injuredPeople', type: 'text', block: 'incident'
    },
    {
      title: 'Дополнительная информация: ', field: 'additionalIncidentInformation', type: 'text', block: 'incident'
    },
    // Заявитель
    {
      title: 'Дата рождения: ', field: 'ukioCallerInfoBeanFK', subField: 'birthdate', type: 'bean', block: 'declarant'
    },
    {
      title: 'Имя организации: ', field: 'ukioCallerInfoBeanFK', subField: 'organizationName', type: 'bean', block: 'declarant'
    },
    {
      title: 'Номер для связи с заявителем: ', field: 'ukioCallerInfoBeanFK', subField: 'phone', type: 'bean', block: 'declarant'
    },
    {
      title: 'Язык заявителя: ', field: 'ukioCallerInfoBeanFK', subField: 'language', type: 'bean', block: 'declarant'
    },
    {
      title: 'Адрес заявителя: ', field: 'ukioCallerInfoBeanFK', subField: 'address', type: 'bean', block: 'declarant'
    },
    {
      title: 'Кольцевой сектр(широта): ', field: 'ukioCallerInfoBeanFK', subField: 'arcbandLatitude', type: 'bean', block: 'declarant'
    },
    {
      title: 'Кольцевой сектр(долгота): ', field: 'ukioCallerInfoBeanFK', subField: 'arcbandLongitude', type: 'bean', block: 'declarant'
    },
    {
      title: 'Кольцевой сектр(внутренний радиус): ', field: 'ukioCallerInfoBeanFK', subField: 'arcbandInnerRadius', type: 'bean', block: 'declarant'
    },
    {
      title: 'Кольцевой сектр(внешний радиус): ', field: 'ukioCallerInfoBeanFK', subField: 'arcbandOuterRadius', type: 'bean', block: 'declarant'
    },
    {
      title: 'Кольцевой сектр(начальный угол): ', field: 'ukioCallerInfoBeanFK', subField: 'arcbandStartAngle', type: 'bean', block: 'declarant'
    },
    {
      title: 'Кольцевой сектр(угол раскрытия): ', field: 'ukioCallerInfoBeanFK', subField: 'arcbandOpeningAngle', type: 'bean', block: 'declarant'
    },
    {
      title: 'Радиус(широта): ', field: 'ukioCallerInfoBeanFK', subField: 'circleLatitude', type: 'bean', block: 'declarant'
    },
    {
      title: 'Радиус(долгота): ', field: 'ukioCallerInfoBeanFK', subField: 'circleLongitude', type: 'bean', block: 'declarant'
    },
    {
      title: 'Точка(широта): ', field: 'ukioCallerInfoBeanFK', subField: 'pointLatitude', type: 'bean', block: 'declarant'
    },
    {
      title: 'Точка(долгота): ', field: 'ukioCallerInfoBeanFK', subField: 'pointLongitude', type: 'bean', block: 'declarant'
    },

  ];
  selectedItem: any;
  constructor(private ukio: UkioService, private route: ActivatedRoute, private router: Router,) { }

  ngOnInit() {
    this.sbscs.push(
      this.route.data.subscribe(
        data => {
          this.callId = data.docItem.callCardId;
          this.listSource = data.docItem.listUkioMessageBeanFK;
          this.cardStatuses = data.docItem.listUkioCardStatusBeanFK;
          this.updatesUkioFrom103 = data.docItem.listUkioUpdateFrom103BeanFK;
          console.log(this.listSource);
        }
      ),
    );
  }

  ngOnDestroy() {
    this.sbscs.forEach(el => el.unsubscribe());
  }

  fitCol(e) {
    e.api.sizeColumnsToFit();
  }

  selectedMessage(e) {
    this.selectedItem = e.data;
    console.log(this.selectedItem);
  }

  getPlateDescriptions(block: string): IPlateInfo[] {
    return this.ukioMessage.filter(el => {
      if (el.block) {
        return el.block === block;
      }
      return false;
    });
  }

  openCall() {
    this.router.navigate([`/calls/${this.callId}`], {relativeTo: this.route});
  }

  getStatusCard(status: number) {
    switch (status) {
      case 2: return 'Карта принята';
      case 3: return 'Вызов принят';
      case 4: return 'Бригада выехала';
      case 5: return 'Бригада прибыла на место';
      case 6: return 'Вызов завершен';
      case 7: return 'Отказ от вызова';
    }
    return '';
  }
}
