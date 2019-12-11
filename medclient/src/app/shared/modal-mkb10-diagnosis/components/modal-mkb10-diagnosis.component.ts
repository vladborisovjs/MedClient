import {Component, OnDestroy, OnInit} from '@angular/core';
import {TreeNode} from 'primeng/api';
import {MedApi, RecordType} from '../../../../../swagger/med-api.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ISimpleDescription, SimpleDescriptionService} from '../../simple-control/services/simple-description.service';
import {FormGroup} from '@angular/forms';
import {Mkb10DiagnosisService} from '../services/mkb10-diagnosis.service';
// import {ColDef} from 'ag-grid-community';
// import {IConditions} from '../../services/check-condition.service';
// берем интерфейсы из модели dictionaries
import {getDictInfo, IDictionaryInfo} from '../../../dictionaries/models/dictionary-structure';
import {debounceTime, take} from 'rxjs/operators';
import {UserService} from '../../../services/user.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-modal-mkb10-diagnosis',
  templateUrl: './modal-mkb10-diagnosis.component.html',
  styleUrls: ['./modal-mkb10-diagnosis.component.scss']
})

export class ModalMkb10DiagnosisComponent implements OnInit, OnDestroy {
  tree: TreeNode[];
  selectedDiagnosis: string;
  form: FormGroup;
  found: boolean = true;
  loading: boolean; // для отображения загрузки
  filters: any[] = []; // фильтры
  showDeleted: boolean = false;
  sbscs: Subscription[] = [];
  description: IDictionaryInfo;

  constructor(
    private api: MedApi,
    private user: UserService,
    private sds: SimpleDescriptionService,
    private mds: Mkb10DiagnosisService,
    private modalInstance: NgbActiveModal) {
  }

  ngOnInit() {
    this.description = getDictInfo('mkb10');
    this.form = this.sds.makeForm(this.description.filters);
    this.form.valueChanges.pipe(debounceTime(300)).subscribe(
      f => {
        this.loading = true; // тру для начала загрузки и фолс в конце updateTree и findNode
        this.filters = [this.showDeleted];
        Object.assign(f, {subdivisionId: this.user.mePerformer.performer.subdivisionFK.id}, this.description.params);
        if (this.description.paramsOrder) {
          this.description.paramsOrder.forEach(
            key => {
              if (f[key] !== null && f[key] !== '') {
                this.filters.push(f[key]);
              } else {
                this.filters.push(undefined);
              }
            }
          );
        }
        this.filters = [...this.filters];
        this.updateTree();
      }
    );
    this.updateTree();
  }

  updateTree() {
    const formParams = [].concat(...this.filters).splice(1);
    if (this.form && (formParams.find(el => !!el))) {  // проверка на существование формы и введенных значений
      this.findNode();
    } else {
      this.tree = null;
      this.api[this.description.method](this.description.rootLevel,
        !this.showDeleted ? this.showDeleted : undefined).pipe(take(1)).subscribe(
        nodes => {
          this.tree = [nodes];
          this.tree[0].expanded = true;
          this.loading = false;
        }
      );
    }
  }

  findNode() {
    this.tree[0].children = [];
    this.sbscs.push(
      this.api[this.description.item.fullListMethod](0, 100, ...this.filters)
        .subscribe(
          nodes => {
            nodes.list.forEach(
              parId => {
                if (parId.nodeCount === 0) {
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
    this.mds.getFullMkb10(e.node.data.id).subscribe(
      nodes => {
        for (let i = 0; i < nodes.children.length; i++) {
          e.node.children.push(nodes.children[i]);
          this.tree = [...this.tree];
        }
        console.log(e);
      }
    );
  }

  selectNode(e) {
    console.log(e);
    if (e.node.data.nodeCount === 0) {
      this.selectedDiagnosis = e.node.data;
    }
    console.log(this.selectedDiagnosis);
  }

  cancel() {
    this.modalInstance.dismiss();
  }

  choose() {
    this.modalInstance.close(this.selectedDiagnosis);
  }

  ngOnDestroy() {
    this.sbscs.forEach(el => el.unsubscribe());
  }
}
