import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {MedApi} from '../../../../../swagger/med-api.service';
import {TreeNode} from 'primeng/api';

@Component({
  selector: 'app-modal-subdivision-tree',
  templateUrl: './modal-subdivision-tree.component.html',
  styleUrls: ['./modal-subdivision-tree.component.scss']
})
export class ModalSubdivisionTreeComponent implements OnInit {
  tree: TreeNode[];
  selectedSubdivision: number;
  constructor(private modalInstance: NgbActiveModal, private api: MedApi) { }

  ngOnInit() {
    this.updateTree();
  }

  updateTree() {
    this.tree = null;
    this.api.getFullSubdivisionNodeUsingGET().subscribe(
      nodes => {
        this.tree = [nodes];
        this.tree[0].expanded = true;
      }
    )
  }

  selectNode(e) {
      this.selectedSubdivision = e.node.data;
  }

  cancel() {
    this.modalInstance.dismiss();
  }

  choose() {
    this.modalInstance.close(this.selectedSubdivision);
  }
}
