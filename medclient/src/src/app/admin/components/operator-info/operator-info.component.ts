import { Component, OnInit } from '@angular/core';
import {OperatorInfoService} from "../services/operator-info.service";
import {CallOperatorInfoBean} from "../../../../../swagger/med-api.service";

@Component({
  selector: 'app-operator-info',
  templateUrl: './operator-info.component.html',
  styleUrls: ['./operator-info.component.scss']
})
export class OperatorInfoComponent implements OnInit {
configList: CallOperatorInfoBean[];
  constructor(private os: OperatorInfoService) { }

  newConfig = {
    ip: null,
    domain: null
  };

  ngOnInit() {
   this.updateConfigList();
  }

  updateConfigList(){
  this.configList = [];
    this.os.getConfig().subscribe(
      res => this.configList = res
    );
  }


  createConfig(){
    let newBean = CallOperatorInfoBean.fromJS({ip: this.newConfig.ip, aor: this.newConfig.domain});
    this.os.updateConfig(newBean).subscribe(
      res => {
        this.newConfig.domain = null;
        this.newConfig.ip = null;
        this.updateConfigList();
      }
    );
  }

  updateConfig(con: CallOperatorInfoBean) {
    this.os.updateConfig(con).subscribe(
      res => {this.updateConfigList();}
    );
  }
}
