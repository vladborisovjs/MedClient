import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {IDictionaryInfo} from '../../models/dictionary-structure';
import {TreeNode} from 'primeng/api';
import {IGridTableDataSource} from '../../../shared/grid-table/components/grid-table/grid-table.component';
import {MedApi} from '../../../../../swagger/med-api.service';
import {CustomModalService} from '../../../shared/modal/services/custom-modal.service';
import {NotificationsService} from 'angular2-notifications';
import {DictionaryService} from '../../services/dictionary.service';

@Component({
  selector: 'app-dictionary-info',
  templateUrl: './dictionary-info.component.html',
  styleUrls: ['./dictionary-info.component.scss']
})
export class DictionaryInfoComponent implements OnInit {
  dataSource: IGridTableDataSource;
  dict: IDictionaryInfo;
  tree: TreeNode[];
  filter: any[];
  selectedItem: any;
  rootLevel: number;
  showDeleted: boolean = false;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private api: MedApi,
              private ns: NotificationsService,
              private cmodal: CustomModalService,
              private dicService: DictionaryService) {
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
        this.dict = data.dict ? data.dict : data.itemWithList;
        if (this.dict.name === 'mkb10') {
          this.rootLevel = -1;
        } else if(this.dict.name === 'inquirer') {
          this.rootLevel = 0;
        } else {
          this.rootLevel = undefined;
        }
        this.updateDataSource();
      }
    );
  }

  updateTree() {
    this.tree = null;
      this.api[this.dict.method](this.rootLevel, !this.showDeleted ? this.showDeleted : undefined).subscribe(
        nodes => {
          this.tree = [nodes];
          this.tree[0].expanded = true;
        }
      );
  }

  goToNextLevel(e) {
    e.node.expanded = true;
    this.api[this.dict.method](e.node.data.id, !this.showDeleted ? this.showDeleted : undefined).subscribe(
      nodes => {
        for (let i = 0; i < nodes.children.length; i++) {
          e.node.children.push(nodes.children[i]);
          this.tree = [...this.tree];
        }
        console.log(e)
      }
    );
  }

  updateTable() {
    this.selectedItem = null;
    this.filter = [this.showDeleted];
    if (this.dict.paramsOrder) {
      this.dict.paramsOrder.forEach(
        key => {
          this.filter.push(this.dict.params[key]);
        }
      );
    }
    this.dataSource = {
      get: (filter, offset, count) => {
        return this.api[this.dict.method](offset, count, ...this.filter);
      }
    };
  }

  updateDataSource() {
    if (this.dict.type === 'list') {
      this.updateTable();
    } else if (this.dict.type === 'tree') {
      this.updateTree();
    }
  }

  goToItem(e) {
    this.router.navigate([e.data.id], {relativeTo: this.route});
  }

  createItem(parentId) {
    this.dicService.nodeParentId = parentId;
    this.router.navigate([0], {relativeTo: this.route});
  }

  selectItem(e) {
    this.selectedItem = e.data;
    console.log(this.selectedItem);
  }

  showDelete() {
    this.showDeleted = !this.showDeleted;
    this.updateTable();
  }

  showFullTree() {
    this.showDeleted = !this.showDeleted;
    this.updateTree();
  }

  deleteItem() {
    this.cmodal.confirm('Удаление', 'Вы уверены, что хотите удалить элемент справочника?').then(
      res => {
        if (res) {
          console.log(this.dict.item.deleteMethod, this.selectedItem.id);
          this.api[this.dict.item.deleteMethod](this.selectedItem.id).subscribe(
            ans => {
              this.ns.success('Успешно', 'Элемент успешно удален');
              this.updateTable();
            },
            error => {
              this.ns.error('Ошибка сервера', 'Не удалось удалить элемент');
              console.log('error', error);
            }
          );
        } else {
          console.log('net');
        }
      }
    );
  }

  // Sergey VIP master race  development
  findIndexTree(nodes, rowData) {
    let foundIndex = nodes.findIndex(el => el.data === rowData);
    if (foundIndex > -1) {
      nodes.splice(foundIndex, 1);
      return true;
    } else {
      for (let i = 0; i < nodes.length; i++) {
        let yes = this.findIndexTree(nodes[i].children, rowData);
        if (yes) {
          return true;
        }
      }
    }
  }

  deleteItemTree(rowData) {
    this.cmodal.confirm('Удаление', 'Вы уверены, что хотите удалить элемент справочника?').then(
      res => {
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
          );
      }
    );
  }

  restoreItemTree(rowData) {
    this.cmodal.confirm('Удаление', 'Вы уверены, что хотите удалить элемент справочника?').then(
      res => {
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
          );
      }
    );
  }

  restoreItem() {
    this.cmodal.confirm('Восстановление', 'Вы уверены, что хотите восстановить элемент справочника?').then(
      res => {
          this.api[this.dict.item.restoreMethod](this.selectedItem.id).subscribe(
            ans => {
              this.ns.success('Успешно', 'Элемент успешно восстановлен');
              this.updateTable();
            },
            error => {
              this.ns.error('Ошибка сервера', 'Не удалось восстановить элемент');
              console.log('error', error);
            }
          );
      }
    );
  }
}
