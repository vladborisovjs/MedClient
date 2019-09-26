import {Component, OnInit} from '@angular/core';
import {TreeNode} from 'primeng/api';
import {MedApi} from '../../../../../swagger/med-api.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-mkb10-diagnosis',
  templateUrl: './modal-mkb10-diagnosis.component.html',
  styleUrls: ['./modal-mkb10-diagnosis.component.scss']
})
export class ModalMkb10DiagnosisComponent implements OnInit {
  tree: TreeNode[];
  rootLevel: number = -1;
  selectedDiagnosis: string;

  constructor(
    private api: MedApi,
    private modalInstance: NgbActiveModal,) {
  }

  ngOnInit() {
    this.updateTree();
  }


  updateTree() {
    this.tree = null;
    this.api.getFullMkbNodeUsingGET(this.rootLevel).subscribe(
      nodes => {
        this.tree = [nodes];
        this.tree[0].expanded = true;
        console.log(this.tree);
      }
    );
  }

  goToNextLevel(e) {
    e.node.expanded = true;
    console.log(e.node.data.id);
    this.api.getFullMkbNodeUsingGET(e.node.data.id).subscribe(
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
}
