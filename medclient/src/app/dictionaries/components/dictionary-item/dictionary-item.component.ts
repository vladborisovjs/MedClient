import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {FormGroup} from '@angular/forms';
import {MedApi} from '../../../../../swagger/med-api.service';
import {NotificationsService} from 'angular2-notifications';

@Component({
  selector: 'app-dictionary-item',
  templateUrl: './dictionary-item.component.html',
  styleUrls: ['./dictionary-item.component.scss']
})
export class DictionaryItemComponent implements OnInit {
  desc: ISimpleDescription[];
  item: any;
  title: string;
  form: FormGroup;
  dictItem: any;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private api: MedApi,
              private ns: NotificationsService,
              private sds: SimpleDescriptionService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.desc = data.itemWithContent.item.descriptions;
      this.item = data.itemWithContent.content;
      this.title = data.itemWithContent.item.title;
      this.dictItem = data.itemWithContent.item;
    });
    this.form = this.sds.makeForm(this.desc);
    this.form.reset(this.item);
  }


  back() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  save() {
    let savingItem =  Object.assign(this.item, this.form.getRawValue());
    console.log(savingItem);
    this.api[this.dictItem.saveMethod](savingItem).subscribe(
      res => {
        console.log('saved:', res);
        this.ns.success('Успешно', 'Справочник обновлен');
      },
      error => {
        console.log('error', error);
      }
    );
  }

  create() {
    let savingItem =  Object.assign(this.item, this.form.getRawValue());
    console.log(savingItem);
    this.api[this.dictItem.createMethod](savingItem).subscribe(
      res => {
        console.log('saved:', res);
        this.ns.success('Успешно', 'Справочник обновлен');
      },
      error => {
        console.log('error', error);
      }
    );
  }

  getBlockDescriptions(block: string): ISimpleDescription[] {
    return this.desc.filter(el => {
      if (el.additional) {
        return el.additional.block === block;
      }
      return false;
    });
  }



}



