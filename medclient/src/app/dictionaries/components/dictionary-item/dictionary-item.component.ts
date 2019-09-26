/**
 * @this.item.data - данные узлов дерева Subdivision
 * @this.item - все остальные данные
 */
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  ISimpleDescription,
  SimpleDescriptionService
} from '../../../shared/simple-control/services/simple-description.service';
import {FormGroup} from '@angular/forms';
import {
  BrigadeStatusBean,
  BrigadeTypeBean, DrugBean,
  MedApi,
  PerformerBean,
  ReferenceTypeBean,
  UnitBean
} from '../../../../../swagger/med-api.service';
import {NotificationsService} from 'angular2-notifications';
import {IDictItem} from '../../models/dictionary-structure';
import {DictionaryService} from '../../services/dictionary.service';
import {CheckConditionService} from "../../../shared/services/check-condition.service";

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
  dictItem: IDictItem;
  reason: string;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private api: MedApi,
              private ns: NotificationsService,
              private sds: SimpleDescriptionService,
              private dicService: DictionaryService,
              private ccs: CheckConditionService) {
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      console.log(data);
      this.desc = data.itemWithContent.item.descriptions;
      this.item = data.itemWithContent.content;
      this.title = data.itemWithContent.item.title;
      this.dictItem = data.itemWithContent.item;
      this.reason = data.itemWithContent.content.reason;
    });
    this.form = this.sds.makeForm(this.desc);
    this.resetForms();
    if (this.dictItem.conditions) {
      this.checkConditions();
    }

  }

  resetForms() {
    if (this.item.data) {
      this.form.reset(this.item.data);
    } else {
      this.form.reset(this.item);
    }
  }

  checkConditions() {
    this.ccs.checkCondition(this.form, this.dictItem.conditions);
  }

  back() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  save() {
    if (this.form.valid) {
      let savingItem;
      if (this.item.data) {
        savingItem = Object.assign(this.item.data, this.form.getRawValue());
        this.item.data.isDeleted = false;
      } else {
        savingItem = Object.assign(this.item, this.form.getRawValue());
        this.dictItem.bean ? savingItem = this.dictItem.bean.fromJS(savingItem) : console.log('Не указан тип бина объекта справочника');
      }
      this.api[this.dictItem.saveMethod](savingItem).subscribe(
        res => {
          console.log('saved:', res);
          this.ns.success('Успешно', 'Справочник обновлен');
        },
        error => {
          console.log('error', error);
        }
      );
    } else {
      for (const i in this.form.controls) {
        if (this.form.controls.hasOwnProperty(i)) {
          this.form.get(i).markAsTouched();
        }
      }
    }
  }

  create() {
    let savingItem;
    if (this.item.data) {
      savingItem = Object.assign(this.item.data, this.form.getRawValue());
      this.item.data.isDeleted = false;
    } else {
      savingItem = Object.assign(this.item, this.form.getRawValue());
    }
    savingItem.deleted = false;
    savingItem.parentId = this.dicService.nodeParentId; // Через сервис пробрасываем parentid для создания потомка
    console.log(this.dicService.nodeParentId);
    console.log(savingItem);
    this.api[this.dictItem.saveMethod](savingItem).subscribe(
      res => {
        console.log('saved:', res);
        this.item = res;
        this.form.reset(res);
        this.ns.success('Успешно', 'Справочник обновлен');
        this.router.navigate([`../${res.id}/`], {relativeTo: this.route})
      },
      error => {
        console.log('error', error);
      }
    );
  }

  delete() {
    let deleteItem = this.item.data ? this.item.data.id : this.item.id;
    this.api[this.dictItem.deleteMethod](deleteItem).subscribe(
      res => {
        console.log('deleted:', res);
        this.item = res;
        this.form.reset(res);
        this.ns.success('Успешно', 'Запись справочника удалена');
      },
      error => {
        console.log('error', error);
      }
    );
  }

  restore() {
    let restoreItem = this.item.data ? this.item.data.id : this.item.id;
    this.api[this.dictItem.restoreMethod](restoreItem).subscribe(
      res => {
        console.log('restore:', res);
        this.item = res;
        this.form.reset(res);
        this.ns.success('Успешно', 'Запись справочника восстановлена');
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



