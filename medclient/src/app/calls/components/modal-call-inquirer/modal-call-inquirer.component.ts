import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {AndyTreeNodeOfInquirerBean, InquirerBean, MedApi} from '../../../../../swagger/med-api.service';

@Component({
  selector: 'app-modal-call-inquirer',
  templateUrl: './modal-call-inquirer.component.html',
  styleUrls: ['./modal-call-inquirer.component.scss']
})
export class ModalCallInquirerComponent implements OnInit {
  loading = true;
  currentNodes: any[] = [];

  constructor(
    private modalInstance: NgbActiveModal,
    private api: MedApi) {
  }

  ngOnInit() {
    this.api.getFullNodeUsingGET(false).subscribe(
      questions => {
        this.loading = false;
        this.makeAns(questions);
      }
    );
  }

  makeAns(node: AndyTreeNodeOfInquirerBean) {
    if (node.data.reason){
      this.modalInstance.close(node.data);
    } else {
      this.currentNodes = node.children;
    }
    return;
  }

  back() {
    this.modalInstance.dismiss();
  }

}
