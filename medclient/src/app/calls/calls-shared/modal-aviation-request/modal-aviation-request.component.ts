import {Component, Input, OnInit} from '@angular/core';
import {AviaRequestBean, CallBean} from '../../../../../swagger/med-api.service';
import {FormGroup} from '@angular/forms';
import {ISimpleDescription, SimpleDescriptionService} from '../../../shared/simple-control/services/simple-description.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-aviation-request',
  templateUrl: './modal-aviation-request.component.html',
  styleUrls: ['./modal-aviation-request.component.scss']
})
export class ModalAviationRequestComponent implements OnInit {
@Input() call: CallBean;
requestItem: AviaRequestBean;

form: FormGroup;
descriptions: ISimpleDescription[] = [
  {
    label: 'Описание',
    key: 'description',
    type: 'textarea',
    additional: {
      block: 'main'
    }
  },
  {
    label: 'Межгоспитальная транспортировка',
    key: 'isInterHospital',
    type: 'checkbox',
    additional: {
      block: 'main'
    }
  },
  {
    label: 'Подразделение (пункт отправки)',
    key: 'departureSubdivisionFK',
    type: 'dict',
    dict: 'getSubdivisionListUsingGET',
    additional: {
      block: 'interHospital'
    }
  },
  {
    label: 'Подразделение (пункт назначения)',
    key: 'destinationSubdivisionFK',
    type: 'dict',
    dict: 'getSubdivisionListUsingGET',
    additional: {
      block: 'interHospital'
    }
  },
];
  constructor(private sds: SimpleDescriptionService,
              private modalInstance: NgbActiveModal) { }

  ngOnInit() {
    this.requestItem = AviaRequestBean.fromJS(
      {
        call: this.call.id,
        id: 0,
        departureHouseNum: this.call.houseNum,
        departureAddress: this.call.address,
        departureLocation: this.call.location
      }
      );
    this.form  = this.sds.makeForm(this.descriptions);
    this.form.valueChanges.subscribe(
      (ch) => {
        Object.assign(this.requestItem, ch);
      }
    );
  }

  sendRequest()
  {
    this.modalInstance.close(Object.assign(this.requestItem, this.form.getRawValue()));
  }

  back(){
    this.modalInstance.dismiss();
  }

  setAddressPoint(geometry) {
    console.log(JSON.parse(geometry));
  }

  getBlockDescriptions(block: string): ISimpleDescription[] {
    return this.descriptions.filter(el => {
      if (el.additional) {
        return el.additional.block === block;
      }
      return false;
    });
  }

}
