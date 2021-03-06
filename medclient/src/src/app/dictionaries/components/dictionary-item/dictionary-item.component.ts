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
import {MedApi} from '../../../../../swagger/med-api.service';
import {NotificationsService} from 'angular2-notifications';
import {IDictItem} from '../../models/dictionary-structure';
import {DictionaryService} from '../../services/dictionary.service';
import {CheckConditionService} from '../../../shared/services/check-condition.service';
import {LogService} from '../../../shared/logs/log.service';
import {MedMapService} from '../../../shared/best-map/services/med-map.service';
import {RoleAccessService} from '../../../services/role-access.service';
import {take} from 'rxjs/operators';
import {_Roles} from '../../../models/user-roles';

@Component({
  selector: 'app-dictionary-item',
  templateUrl: './dictionary-item.component.html',
  styleUrls: ['./dictionary-item.component.scss'],
  providers: [MedMapService]
})
export class DictionaryItemComponent implements OnInit {
  desc: ISimpleDescription[];
  item: any;
  title: string;
  form: FormGroup;
  dictItem: IDictItem;
  reason: string;
  lockSettingPoint = true; // флаг - надо ли считывать клик с карты для сохранения координат
  Roles = _Roles;
  childCount: number = null; // количество детей узла
  endField: string = null;
  coordinates= [0,0]; // координаты объекта

  constructor(private route: ActivatedRoute,
              private router: Router,
              private api: MedApi,
              private ns: NotificationsService,
              private sds: SimpleDescriptionService,
              private dicService: DictionaryService,
              private logS: LogService,
              private ms: MedMapService,
              public access: RoleAccessService,
              private ccs: CheckConditionService) {
  }

  ngOnInit() {
    this.route.data.pipe(take(1)).subscribe(data => {
      console.log(data);
      this.desc = data.itemWithContent.item.descriptions;
      this.item = data.itemWithContent.content;
      this.title = data.itemWithContent.item.title;
      this.dictItem = data.itemWithContent.item;
      this.reason = data.itemWithContent.content.reason;
      if (data.itemWithContent.endField) {
        this.endField = data.itemWithContent.endField;
      }
    });
    // отключение формы, если ее добавление нарушает логику справочника
    // (поле endFiel подразумевает, что данный нод конечный и не имеет детей)
    this.form = this.sds.makeForm(this.desc);
    if (this.endField && this.form.controls[this.endField] && this.item.childrenExist > 0) {
      this.form.controls[this.endField].disable({emitEvent: false});
      console.log('disabled');
    }
    this.resetForms();
    if (this.dictItem.conditions) {
      this.checkConditions();
    }

  }

  initMapPoint() {
    if (this.item.location) {
      this.ms.setPointLonLat(JSON.parse(this.item.location));
      this.ms.setMapViewOnPoint(JSON.parse(this.item.location));
      this.coordinates = JSON.parse(this.item.location).coordinates;
    } else {
      this.ms.setDefaultView();
    }
  }

  setLocationFromClick(geometry) {
    if (!this.lockSettingPoint) {
      this.item.location = JSON.stringify(geometry);
      this.ms.setPointLonLat(geometry);
      this.coordinates = JSON.parse(this.item.location).coordinates;
    }
  }

  setLocationFromInput(geometry) {
    if (!this.lockSettingPoint) {
      this.item.location = JSON.stringify(geometry);
      this.ms.setPointLonLat(geometry);
      this.ms.setMapViewOnPoint(geometry);
      this.coordinates = JSON.parse(this.item.location).coordinates;
    }
  }
  deleteCoordinates() {
    this.item.location = null;
    this.ms.drawPoint([0,0]);
    this.ms.setDefaultView();
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

  create() { // todo: перепроверить логику, отличие деревенного от табличного
    let savingItem;
    if (this.item.data) {
      savingItem = Object.assign(this.item.data, this.form.getRawValue());
      this.item.data.isDeleted = false;
    } else {
      savingItem = Object.assign(this.item, this.form.getRawValue());
    }
    savingItem.isDeleted = false;
    savingItem.parentId = this.dicService.nodeParentId; // Через сервис пробрасываем parentid для создания потомка
    if (savingItem.isHelicopter) {
      savingItem.subdivision = 1;
    }
    console.log(savingItem);
    this.api[this.dictItem.saveMethod](savingItem).subscribe(
      res => {
        console.log('saved:', res);
        this.item = res;
        this.form.reset(res);
        this.ns.success('Успешно', 'Справочник обновлен');
        this.router.navigate([`../${res.id}/`], {relativeTo: this.route});
      },
      error => {
        console.log('error', error);
      }
    );
  }

  delete() {
    const deleteItem = this.item.data ? this.item.data.id : this.item.id;
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
    const restoreItem = this.item.data ? this.item.data.id : this.item.id;
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

  openLog() {
    this.logS.openLog(this.item.id, this.dictItem.recordType);
  }


}



