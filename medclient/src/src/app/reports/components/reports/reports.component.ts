import { Component, OnInit } from '@angular/core';
import {IReport, reportsList} from "../../models/report-models";
import {ReportService} from "../../services/report.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ModalReportOptionsComponent} from "../modal-report-options/modal-report-options.component";

@Component({
  selector: 'app-components',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  commonList: IReport[] = reportsList.filter(r => r.block !== 'statistical');
  statisticalList: IReport[] = reportsList.filter(r => r.block === 'statistical');
  constructor(private rs: ReportService, private modal: NgbModal) { }

  ngOnInit() {
  }

  printReport(report: IReport) {
    if (report.inputParams){
      const repOpt = this.modal.open(ModalReportOptionsComponent);
      repOpt.componentInstance.report = report;
      repOpt.result.then(
        options => {
          console.log(options);
          const subs = options.subdivision;
            if (options.multiplePrint) {
             for (let i = 0; i < subs.length; i++) {
               options.subdivision = subs[i];
               this.rs.printReport(report, options);
             }
            } else {
              this.rs.printReport(report, options);
            }
        }
      );
    } else {
      this.rs.printReport(report);
    }
  }
}
