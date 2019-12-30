import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges, OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import {ICallsTableFilter} from "../calls-container/calls-container.component";
import {ColDef, GridApi} from "ag-grid-community";
import {BrigadeDutyService} from "../../services/brigade-duty.service";
import {take} from "rxjs/operators";
import {BrigadeContainer} from "../../../../../swagger/med-api.service";
import {SocketTopicsService} from "../../../shared/socket-topic/services/socket-topics.service";
import {Subscription} from "rxjs";
import {LogService} from "../../../shared/logs/log.service";

@Component({
  selector: 'app-bri-table',
  templateUrl: './bri-table.component.html',
  styleUrls: ['./bri-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BriTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() filters: ICallsTableFilter;

  mode: 'online' | 'offline' | 'upcoming' = 'online'; // на линии, не на линии...
  colDefs: ColDef[] = [
    {
      headerName: 'Бригада',
      field: 'first.name',
      sortable: true,
      filter: true,
      width: 130
    },
    {
      headerName: 'Тип',
      field: 'first.brigadeTypeFK.name',
      sortable: true,
      filter: true,
      width: 270
    },
    {
      headerName: 'Статус',
      field: 'first.brigadeStatusFK.name',
      sortable: true,
      filter: true,
      width: 190
    },
  ];
  gridOptions = {
    getRowClass: (params) => {
      if (new Date(params.data && params.data.second[0].dateTo) < new Date()) {
        return 'text-danger';
      }
    }
  };
  selectedBrigade: any;
  brigadeContainer: BrigadeContainer;
  brigadeList: any[] = [];
  brigadeCallList: any[] = [];
  gridApi: GridApi;
  collapsed: boolean = false;

  sbscs: Subscription[] = [];


  constructor(private bs: BrigadeDutyService,
              private cdRef: ChangeDetectorRef,
              private sTopics: SocketTopicsService,) {
  }

  ngOnInit() {
    let collapsed = localStorage.getItem('call-brigades-collapsed');
    this.collapsed = collapsed ? JSON.parse(collapsed) : true;
    this.sbscs.push(
      this.sTopics.brigadeStatusSub.subscribe(
        (bstatus)=>{
          console.log(bstatus);
          if (!this.gridApi) return;

          if (this.mode === 'online'){
            let node = this.gridApi.getRenderedNodes().find(
              node => node.data.first.id === bstatus.brigadeId
            );
            if (!node) { // бригады нет на линии, обновляем список
              this.updateBrigadesList();
              return;
            }
            if (bstatus.actualStatus.code === 'OFFLINE'){
              this.gridApi.updateRowData({remove: [node.data]})
            }
            let updateData = node.data;
            updateData.first.brigadeStatusFK = bstatus.actualStatus;
            node.updateData(updateData);
            return;
          }
          // todo: протестировать
          if (this.mode === 'offline' && bstatus.actualStatus.code === 'FREE_ON_BASE'){
            let node = this.gridApi.getRenderedNodes().find(
              node => node.data.first.id === bstatus.brigadeId
            );
            if (node) this.gridApi.updateRowData({remove: [node.data]});
            return;
          }

        }
      ),
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    this.updateBrigadesList();
  }

  ngOnDestroy() {
    this.cdRef.detach();
  }

  updateBrigadesList() {
    this.gridApi && this.gridApi.showLoadingOverlay();
    this.bs.getBrigadesOnDuty(this.mode, this.filters).pipe(take(1)).subscribe(
      b => {
        this.brigadeList = b;
        this.gridApi && this.gridApi.hideOverlay();
        this.cdRef.detectChanges()
      }
    );
  }

  changeMode(mode) {
    this.mode = mode;
    this.selectedBrigade = null;
    this.updateBrigadesList();
  }

  getGridApi(e) {
    this.gridApi =e.api;
    if (!this.brigadeList.length){
      this.gridApi && this.gridApi.showLoadingOverlay();
    }
  }

  selectBrigade(e) {
    this.selectedBrigade = e.data;
    this.brigadeContainer = null;
    this.brigadeCallList = [];
    this.bs.getBriCrew(this.selectedBrigade.first.id, this.selectedBrigade.second[0].dateFrom).pipe(take(1))
      .subscribe( bc=> {
        this.brigadeContainer = bc;
        this.cdRef.detectChanges();
      });
    this.bs.getBrigadeCallsList(this.selectedBrigade.first.id).pipe(take(1))
      .subscribe( cl=> {
        this.brigadeCallList = cl.list;
        this.cdRef.detectChanges();
      });
  }

  changeCollapse(){
    this.collapsed = !this.collapsed;
    localStorage.setItem('call-brigades-collapsed', JSON.stringify(this.collapsed));
  }

}
