import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'callStatus'
})
export class CallStatusPipe implements PipeTransform {

  transform(callStatus: number, type: 'text' | 'withIcon' = 'withIcon' ): any {
    if (type === 'withIcon'){
      switch (callStatus) {
        case 0:
          return '<i class="fas fa-exclamation-circle blinking text-danger"></i> Бригада не назначена';
        case 1:
          return '<i class="fas fa-exclamation-circle text-warning"></i> Не принят бригадой';

        case 2:
          return '<i class="fas fa-clipboard-check text-primary"></i> Принят бригадой';

        case 3:
          return '<i class="fas fa-cog text-primary fa-spin"></i> В работе';

        case 4:
          return '<i class="fas fa-check-circle text-success"></i> Завершен';

        case 5:
          return '<i class="fas fa-people-carry text-primary"></i>  Требуется эвакуация';
        case 6:
          return '<i class="fas fa-ambulance text-primary"></i>  Мед. эвакуация';
        default:
          return callStatus;
      }
    } else if (type === 'text'){
      switch (callStatus) {
        case 0:
          return 'Бригада не назначена';
        case 1:
          return 'Не принят бригадой';

        case 2:
          return 'Принят бригадой';

        case 3:
          return 'В работе';

        case 4:
          return 'Завершен';

        case 5:
          return 'Требуется эвакуация';
        case 6:
          return 'Мед. эвакуация';
        default:
          return callStatus;
      }
    }

    return callStatus;
  }

}
