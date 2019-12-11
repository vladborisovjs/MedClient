import { Pipe, PipeTransform } from '@angular/core';

interface IManName {
  surname: string,
  name: string,
  patronymic: string
}

@Pipe({
  name: 'fullnameShorter'
})

/**
 * {Фамилия Имя Отчество}  ---> 'Фамилия И.О.'
 * [{Фамилия1 Имя Отчество}, {Фамилия2 Имя Отчество}] ---> 'Фамилия1 И.О., Фамилия2 И.О.'
 */

export class FullnameShorterPipe implements PipeTransform {

  cutName(man: IManName){
    return   (man.surname ? man.surname : '')  + (man.name ? ' ' +  man.name[0] + '.' : '') + (man.patronymic ? man.patronymic[0] + '.' : '');
  }

  transform(man: IManName | IManName[] | any): string {
    let result = '';
    if (!man || man === []) return result;

    if (man instanceof Array){
      man.forEach(
        p => {
          result = result + this.cutName(p) + ', ';
        }
      );
      result = result.slice(0, -2);
    } else {
      result = this.cutName(man);
    }
    return result;
  }

}
