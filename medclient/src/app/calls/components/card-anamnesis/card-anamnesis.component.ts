import {Component, OnDestroy, OnInit} from '@angular/core';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';
import {Subscription} from 'rxjs';
import {CardItemService} from '../../services/card-item.service';
import {CardAnamnesisPartDto} from '../../../../../swagger/med-api.service';
import {FormGroup} from '@angular/forms';
import {NotificationsService} from 'angular2-notifications';

@Component({
  selector: 'app-card-anamnesis',
  templateUrl: './card-anamnesis.component.html',
  styleUrls: ['./card-anamnesis.component.scss']
})
export class CardAnamnesisComponent implements OnInit, OnDestroy {
  sbscs: Subscription[] = [];
  anamnesis: CardAnamnesisPartDto;
  cardId: any;
  forms: {
    block: string,
    descriptions: ISimpleDescription[],
    form?: FormGroup
  }[] =
    [
    {
      block: 'epidemic',
      descriptions: [
        {
          label: 'Контакт с инф. больными',
          type: 'textarea',
          key: 'infect_contacts',
        },
        {
          label: 'Карантин: ',
          type: 'text',
          key: 'quarantine',
          styleClass: 'line-form col-12'
        },
        {
          label: 'Вакцинация: ',
          type: 'text',
          key: 'vaccination',
          additional: {
            block: 'epidemic'
          },
          styleClass: 'line-form col-12'
          // allergic
        },
      ]
    },
    {
      block: 'allergic',
      descriptions: [
        {
          label: 'Аллергии: ',
          type: 'select',
          key: 'allergic_anamnesis',
          selectList: [
            {
              name: 'Не указано', id: 0
            },
            {
              name: 'Не отягощен', id: 1
            },
            {
              name: 'Отягощен', id: 0
            },
          ],
          styleClass: 'line-form col-12'
        },
        {
          label: 'Не переносит',
          type: 'textarea',
          key: 'allergic_anamnesis_text',
        },
      ]
    },
    {
      block: 'gynecologic',
      descriptions: [
        {
          label: '',
          key: 'gynecologic_anamnesis',
          rows: 3,
          type: 'textarea',
        },
      ]
    },
    {
      block: 'complaints',
      descriptions: [
        {
          label: '',
          key: 'complaints_anamnesis',
          rows: 3,
          type: 'textarea',
        },
      ]
    },
    {
      block: 'illnes',
      descriptions: [
        {
          label: 'Анемнез',
          key: 'illnes_anamnesis',
          rows: 3,
          type: 'textarea',
        },
        {
          label: 'Перенесенные (кратко)',
          key: 'past_illneses',
          rows: 3,
          type: 'textarea',
        },
      ]
    },
  ];
  constructor(private route: ActivatedRoute,
              private cas: CardItemService,
              private sds: SimpleDescriptionService,
              private ns: NotificationsService) {
  }

  ngOnInit() {
    this.forms.forEach(
      f => {
        f.form = this.sds.makeForm(f.descriptions);
      }
    );
    this.sbscs.push(
      this.route.data.subscribe(data => {
        this.anamnesis = data.anamnesis;
      }),
      this.route.parent.paramMap.subscribe(data => {
        this.cardId = data.get('cardId');
      })
    );
  }

  ngOnDestroy() {
    this.sbscs.forEach(el => el.unsubscribe());
  }

  getBlockDescriptions(block: string): ISimpleDescription[] {
    let desc: ISimpleDescription[];
    this.forms.forEach(
      f => {
        if (f.block === block) {
          desc = f.descriptions;
        }
      }
    );
    return desc;
  }

  getBlockForm(block: string): FormGroup {
    let form: FormGroup;
    this.forms.forEach(
      f => {
        if (f.block == block) {
          form =  f.form;
        }
      }
    );
    return form;
  }

  getBlockFormValues(block: string) {
    let values;
    this.forms.forEach(
      f => {
        if (f.block === block) {
          values = f.form.getRawValue();
        }
      }
    );
    return values;
  }

  save() {
    let anam = {};
    Object.keys(this.anamnesis).forEach(
      key => {
        Object.assign(anam, this.getBlockFormValues(key));
      }
    );
    this.anamnesis.header.is_created = true;
    this.cas.saveAnamnesis(this.cardId, anam).subscribe(
      res => {
        this.ns.success('Успешно', 'Изменения успешно сохранены');
        this.anamnesis = res;
      },
      error =>{
        this.ns.error('Ошибка', 'Не удалось сохранить изменения')
      }
    );
  }

}
