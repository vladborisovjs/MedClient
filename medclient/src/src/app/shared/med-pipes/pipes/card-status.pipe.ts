import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'cardStatus'
})
export class CardStatusPipe implements PipeTransform {

  transform(status: number): any {
    let statusText = '';
    switch (status) {
      case 0:
        statusText = 'Не оформлена';
        break;
      case 1:
        statusText = 'На проверке';
        break;
      case 2:
        statusText = 'Отправлена на доработку';
        break;
      case 3:
        statusText = 'Готова к отправке';
        break;
      case 4:
        statusText = 'Отправлена в ЕГИСЗ';
        break;
      case 5:
        statusText = 'Закрыта';
        break;
      default:
        statusText = 'Не оформлена';
        break;
    }
    return statusText;
  }

}
