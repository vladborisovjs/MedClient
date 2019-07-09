import {Component, Input, OnInit} from '@angular/core';
import {UserService} from '../../../services/user.service';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {FormGroup} from '@angular/forms';
import {ScheduleService} from '../../services/schedule.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-prolongation',
  templateUrl: './modal-prolongation.component.html',
  styleUrls: ['./modal-prolongation.component.scss']
})
export class ModalProlongationComponent implements OnInit {
  dateItem: any;
  desc: ISimpleDescription[] = [
    {
      label: 'С: ',
      key: 'from',
      type: 'date',
      showTime: false,
      styleClass: 'line-form col-12'
    },
    {
      label: 'По: ',
      key: 'to',
      type: 'date',
      showTime: false,
      styleClass: 'line-form col-12'
    },
  ];
  form: FormGroup;

  constructor(private user: UserService,
              private sds: SimpleDescriptionService,
              private modalInstance: NgbActiveModal,
              private schs: ScheduleService) { }

  ngOnInit() {
    let date = new Date();
    this.dateItem= {
      from: new Date(date.getFullYear(), date.getMonth() + 1, 1),
      to: new Date(date.getFullYear(), date.getMonth() + 2, 0)
    };
    this.form = this.sds.makeForm(this.desc);
    console.log(this.dateItem);
  }

  submit(){
    Object.assign(this.dateItem, this.form.getRawValue());
    this.schs.prolongationGet(this.dateItem.from.toISOString(), this.dateItem.to.toISOString()).subscribe(
      res => {
        console.log('res1', res);
        this.schs.prolongationPost(res).subscribe(
          res2 => {
            console.log('res2', res2);
          }
        )
      }
    );
  }
  back() {
    this.modalInstance.dismiss();
  }

}
