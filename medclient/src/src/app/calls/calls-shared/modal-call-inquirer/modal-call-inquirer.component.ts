import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {InquirerBean, MedApi, TreeNodeOfInquirerView} from '../../../../../swagger/med-api.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-modal-call-inquirer',
  templateUrl: './modal-call-inquirer.component.html',
  styleUrls: ['./modal-call-inquirer.component.scss']
})
export class ModalCallInquirerComponent implements OnInit, OnDestroy {
  loading = true;
  currentNodes: any[] = [];
  previousNodes: any[] = [];
  rootLevel: number = 0;
  sbscs: Subscription[] = [];
  constructor(
    private modalInstance: NgbActiveModal,
    private api: MedApi) {
  }

  ngOnInit() {
    this.getInquirer(this.rootLevel);
  }

  makeAns(node: TreeNodeOfInquirerView) {
    if (node.data.reason) {
      this.modalInstance.close(node.data);
    } else {
      this.getInquirer(node.data.id);
    }
  }

  getInquirer(dataId) {
    this.sbscs.push(
      this.api.getBranchNodeUsingGET(dataId, false).subscribe(
        questions => {
          this.loading = false;
          this.currentNodes = questions.children;
          this.previousNodes.push(this.currentNodes);
        }
      )
    );
  }

  backToPreviousQuestion() {
    this.previousNodes.splice(this.previousNodes.length - 1, 1);
    this.currentNodes = this.previousNodes[this.previousNodes.length - 1];
  }

  back() {
    this.modalInstance.dismiss();
  }

  ngOnDestroy() {
    this.sbscs.forEach(el => el.unsubscribe());
  }
}
