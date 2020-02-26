import { Component, OnInit, Input } from '@angular/core';
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
  selectedSubdivision: any[] = [];
  @Input() isMultiple: boolean;
  constructor(private modalInstance: NgbActiveModal, private api: MedApi) { }

  ngOnInit() {
    this.updateTree();
  }

  updateTree() {
    this.tree = null;
    this.api.getFullSubdivisionNodeUsingGET().subscribe(
      nodes => {
        this.tree = [nodes];
        console.log(this.tree);
        if (this.isMultiple) {
          this.tree[0].data = {name: ''};
        }
        this.tree[0].expanded = true;
      }
    )
  }

  selectNode(e) {
    if (!this.isMultiple) {
      this.selectedSubdivision = e.node.data;
    }
    console.log(e);
  }

  selectAllSubs() {
    this.selectedSubdivision = [...this.tree[0].children];
    console.log(this.selectedSubdivision);
  }

  cancel() {
    this.modalInstance.dismiss();
  }

  choose() {
    this.modalInstance.close(this.selectedSubdivision);
  }
}
