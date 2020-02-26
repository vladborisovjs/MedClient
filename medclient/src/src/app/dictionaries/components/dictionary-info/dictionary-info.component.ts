import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {IDictionaryInfo} from '../../models/dictionary-structure';
import {TreeNode} from 'primeng/api';
import {IGridTableDataSource} from '../../../shared/grid-table/components/grid-table/grid-table.component';
import {MedApi} from '../../../../../swagger/med-api.service';
import {CustomModalService} from '../../../shared/modal/services/custom-modal.service';
import {NotificationsService} from 'angular2-notifications';
import {DictionaryService} from '../../services/dictionary.service';
import {FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';
import {debounceTime, take} from 'rxjs/operators';
import {
  ISimpleDescription,
  SimpleDescriptionService
} from '../../../shared/simple-control/services/simple-description.service';
import {RoleAccessService} from '../../../services/role-access.service';
import {UserService} from '../../../services/user.service';
import {_Roles} from '../../../models/user-roles';

@Component({
  selector: 'app-dictionary-info',
  templateUrl: './dictionary-info.component.html',
  styleUrls: ['./dictionary-info.component.scss']
})
export class DictionaryInfoComponent implements OnInit, OnDestroy {
  dataSource: IGridTableDataSource;
  dict: IDictionaryInfo;
  tree: TreeNode[];
  filters: any[] = []; // фильтры
  defaultFilters: any = {}; // subdivisionId и dict.params
  selectedItem: any;
  rootLevel: number = undefined; // по дефолту ставим андефайнед, нужен для параметров апишки
  showDeleted: boolean = false;
  form: FormGroup; // форма фильтров справочника
  sbscs: Subscription[] = [];
  loading: boolean; // для отображения загрузки
  Roles = _Roles; // роли которые могут редактировать справочник своео подразделения

  constructor(private route: ActivatedRoute,
              private router: Router,
              private api: MedApi,
              private user: UserService,
              private sds: SimpleDescriptionService,
              private ns: NotificationsService,
              private cmodal: CustomModalService,
              public access: RoleAccessService,
              private dicService: DictionaryService) {
  }

  ngOnInit() {
    // this.searchForm = this.sds.makeForm(this.description);
    this.route.data.pipe(take(1)).subscribe(data => {
        this.dict = data.dict;
        this.defaultFilters = Object.assign({},
          {subdivisionId: this.user.mePerformer.performer.subdivisionFK.id}, this.dict.params);
        this.loading = true; // тру для начала загрузки и фолс в конце updateTree и findNode
        this.filters = [this.showDeleted];
        this.setFiltersByParamsOrder();
        if (this.dict.filters) {
          this.form = this.sds.makeForm(this.dict.filters);
          this.form.valueChanges.pipe(debounceTime(300)).subscribe(
            f => {
              this.loading = true; // тру для начала загрузки и фолс в конце updateTree и findNode
              this.filters = [this.showDeleted];
              Object.assign(this.defaultFilters, f);
              this.setFiltersByParamsOrder();
              if (this.dict.type === 'tree') {
                this.updateTree();
              }
            }
          );
        }
      }
    );
    this.updateDataSource();
  }

  setFiltersByParamsOrder() {
    if (this.dict.paramsOrder) {
      this.dict.paramsOrder.forEach(
        key => {
          if (this.defaultFilters[key] !== null && this.defaultFilters[key] !== '') {
            this.filters.push(this.defaultFilters[key]);
          } else {
            this.filters.push(undefined);
          }
        }
      );
    }
    this.filters = [...this.filters];
  }

  updateDataSource() {
    if (this.dict.type === 'list') {
      this.updateTable();
    } else if (this.dict.type === 'tree') {
      this.updateTree();
    }
  }

  updateTree() {
    if (this.dict.rootLevel !== undefined) { // присваиваем рут левел если есть в модели
      this.rootLevel = this.dict.rootLevel;
    }
    const formParams = [].concat(...this.filters).splice(1);
    if (this.form && (formParams.find(el => !!el))) {  // проверка на существование формы и введенных значений
      this.findNode();
    } else {
      this.tree = null;
      this.api[this.dict.method](this.rootLevel, !this.showDeleted ? this.showDeleted : undefined).pipe(take(1)).subscribe(
        nodes => {
          this.tree = [nodes];
          this.tree[0].expanded = true;
          this.loading = false;
        }
      );
    }
  }

  updateTable() {
    this.dataSource = {
      get: (filter, offset, count) => {
        return this.api[this.dict.method](offset, count, ...this.filters);
      }
    };
  }

  findNode() {
    this.tree[0].children = [];
    this.sbscs.push(
      this.api[this.dict.item.fullListMethod](0, 100, ...this.filters)
        .subscribe(
          nodes => {
            nodes.list.forEach(
              parId => {
                if (!parId.childrenExist) {
                  this.tree[0].children.push({children: [], data: parId});
                  this.tree = [...this.tree];
                }
              }
            );
            this.loading = false;
          }
        )
    );
  }

  goToNextLevel(e) {
    e.node.expanded = true;
    this.sbscs.push(
      this.api[this.dict.method](e.node.data.id, !this.showDeleted ? this.showDeleted : undefined).subscribe(
        nodes => {
          console.log(nodes);
          for (const child of nodes.children) {
            e.node.children.push(child);
            this.tree = [...this.tree];
          }
        }
      )
    );
  }

  goToItem(e) {
    this.router.navigate([e.data.id], {relativeTo: this.route});
  }

  createItem(parentId?) {
    this.dicService.nodeParentId = parentId;
    this.router.navigate([0], {relativeTo: this.route});
  }

  selectItem(e) {
    this.selectedItem = e.data;
  }

  showDelete() { // переключение удаленные/активные записи табличного справочника
    this.showDeleted = !this.showDeleted;
    this.filters[0] = this.showDeleted; // не по кайфу, надо пересобрать фильтр в отдельный функции
    this.filters = [...this.filters];
  }

  showFullTree() {
    this.showDeleted = !this.showDeleted;
    this.updateTree();
  }

  deleteItem() {
    this.cmodal.confirm('Удаление', 'Вы уверены, что хотите удалить элемент справочника?').then(
      res => {
        if (res) {
          this.sbscs.push(
            this.api[this.dict.item.deleteMethod](this.selectedItem.id).subscribe(
              ans => {
                this.ns.success('Успешно', 'Элемент успешно удален');
                this.updateDataSource();
              },
              error => {
                this.ns.error('Ошибка сервера', 'Не удалось удалить элемент');
                console.log('error', error);
              }
            )
          );
        } else {
          console.log('net');
        }
      }
    );
  }

  // Sergey VIP master race  development
  findIndexTree(nodes, rowData) {
    const foundIndex = nodes.findIndex(el => el.data === rowData);
    if (foundIndex > -1) {
      nodes.splice(foundIndex, 1);
      return true;
    } else {
      for (const node of nodes) {
        if (this.findIndexTree(node.children, rowData)) {
          return true;
        }
      }
    }
  }

  deleteItemTree(rowData) {
    this.cmodal.confirm('Удаление', 'Вы уверены, что хотите удалить элемент справочника?').then(
      res => {
        this.sbscs.push(
          this.api[this.dict.item.deleteMethod](rowData.id).subscribe(
            ans => {
              this.ns.success('Успешно', 'Элемент успешно удален');
              if (this.findIndexTree(this.tree, rowData)) {
                this.tree = [...this.tree];
              }
            },
            error => {
              this.ns.error('Ошибка сервера', 'Не удалось удалить элемент');
              console.log('error', error);
            }
          )
        );
      }
    );
  }

  restoreItemTree(rowData) {
    this.cmodal.confirm('Удаление', 'Вы уверены, что хотите удалить элемент справочника?').then(
      res => {
        this.sbscs.push(
          this.api[this.dict.item.restoreMethod](rowData.id).subscribe(
            ans => {
              this.ns.success('Успешно', 'Элемент успешно удален');
              this.updateTree();
              if (this.findIndexTree(this.tree, rowData)) {
                this.tree = [...this.tree];
              }
            },
            error => {
              this.ns.error('Ошибка сервера', 'Не удалось удалить элемент');
              console.log('error', error);
            }
          )
        );
      }
    );
  }

  restoreItem() {
    this.cmodal.confirm('Восстановление', 'Вы уверены, что хотите восстановить элемент справочника?').then(
      res => {
        this.sbscs.push(
          this.api[this.dict.item.restoreMethod](this.selectedItem.id).subscribe(
            ans => {
              this.ns.success('Успешно', 'Элемент успешно восстановлен');
              this.updateDataSource();
            },
            error => {
              this.ns.error('Ошибка сервера', 'Не удалось восстановить элемент');
              console.log('error', error);
            }
          )
        );
      }
    );
  }

  ngOnDestroy() {
    this.sbscs.forEach(el => el.unsubscribe());
  }
}
