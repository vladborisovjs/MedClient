import {Component, OnDestroy, OnInit} from '@angular/core';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';
import {Subscription} from 'rxjs';
import {CardItemService} from '../../services/card-item.service';
import {CardBean} from '../../../../../swagger/med-api.service';
import {FormGroup} from '@angular/forms';
import {NotificationsService} from 'angular2-notifications';

@Component({
  selector: 'app-card-anamnesis',
  templateUrl: './card-anamnesis.component.html',
  styleUrls: ['./card-anamnesis.component.scss']
})
export class CardAnamnesisComponent implements OnInit, OnDestroy {
  sbscs: Subscription[] = [];
  form: FormGroup;
  card: CardBean;
  descriptions: ISimpleDescription[] = [
    // epidemic
    {
      label: 'Контакт с инф. больными',
      type: 'textarea',
      key: 'infectContacts',
      additional: {
        block: 'epidemic'
      }
    },
    {
      label: 'Карантин: ',
      type: 'text',
      key: 'quarantine',
      styleClass: 'line-form col-12',
      additional: {
        block: 'epidemic'
      },
    },
    {
      label: 'Вакцинация: ',
      type: 'text',
      key: 'vaccination',
      additional: {
        block: 'epidemic'
      },
      styleClass: 'line-form col-12'
    },
    // allergic
    {
      label: 'Аллергии: ',
      type: 'select',
      key: 'allergicAnamnesis',
      selectList: [
        {
          name: 'Не указано', id: null
        },
        {
          name: 'Не отягощен', id: true
        },
        {
          name: 'Отягощен', id: false
        },
      ],
      additional: {
        block: 'allergic'
      },
      styleClass: 'line-form col-12',
    },
    {
      label: 'Не переносит',
      type: 'textarea',
      key: 'allergicAnamnesisText',
      additional: {
        block: 'allergic'
      },
    },

    {
      label: '',
      key: 'gynecologicAnamnesis',
      rows: 3,
      type: 'textarea',
      additional: {
        block: 'gynecologic'
      },
    },

    {
      label: '',
      key: 'complaintsAnamnesis',
      rows: 3,
      type: 'textarea',
      additional: {
        block: 'complaints'
      },
    },
    //illnes
    {
      label: 'Анемнез',
      key: 'illnessAnamnesis',
      rows: 3,
      type: 'textarea',
      additional: {
        block: 'illnes'
      },
    },
    {
      label: 'Перенесенные (кратко)',
      key: 'pastIllnesses',
      rows: 3,
      type: 'textarea',
      additional: {
        block: 'illnes'
      },
    },
  ];

  constructor(private route: ActivatedRoute,
              private cas: CardItemService,
              private sds: SimpleDescriptionService,
              private ns: NotificationsService) {
  }

  ngOnInit() {
    this.form = this.sds.makeForm(this.descriptions);
    this.sbscs.push(
      this.cas.cardItemSub.subscribe(card => this.card = card),
      this.form.valueChanges.subscribe(ch => Object.assign(this.card.cardObjectiveBean, ch))
    );
  }

  ngOnDestroy() {
    this.sbscs.forEach(el => el.unsubscribe());
  }

  getBlockDescriptions(block: string): ISimpleDescription[] {
    return this.descriptions.filter(el => {
      if (el.additional) {
        return el.additional.block === block;
      }
      return false;
    });
  }

}
