import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {
  @Input() title: string;
  @Input() content: string;
  @Input() confirmText: string = 'Подтвердить';
  @Input() dismissText: string = 'Отмена';

  constructor(private modalInstance: NgbActiveModal) { }

  ngOnInit() {
  }

  back() {
    this.modalInstance.close(false);
  }

  submit() {
    this.modalInstance.close(true);
  }

}
