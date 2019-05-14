import { Component, OnInit } from '@angular/core';
import {interval} from 'rxjs';
import {ColDef} from 'ag-grid-community';
import {MedApi} from '../../../../../swagger/med-api.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-brigages-list',
  templateUrl: './brigages-list.component.html',
  styleUrls: ['./brigages-list.component.scss']
})
export class BrigagesListComponent implements OnInit {
listSource = [];
colDefs: ColDef[] = [
    {
      headerName: 'Бригада',
      field: 'full_name',
      sortable: true,
      filter: true
    },
    {
      headerName: 'Тип',
      field: 'br_type_name',
      sortable: true,
      filter: true
    },
    {
      headerName: 'Статус',
      field: 'declarant_name',
      sortable: true,
      filter: true
    },
    {
      headerName: 'Состав',
      field: 'reason_name',
      sortable: true,
      filter: true
    },
  ];

  constructor(private api: MedApi, private http: HttpClient) { }

  ngOnInit() {
    this.api.readAllUsingGET_4(false,120).subscribe(
      bri => {
        console.log('->', bri);
        this.listSource = bri;
      }
    );
    // interval(10000).subscribe(
    //   el => {
    //     this.api.readAllUsingGET_4(false,120).subscribe(
    //       bri => {
    //         console.log('->', bri);
    //         this.listSource = bri;
    //       }
    //     );
    //   }
    // );
  }

}
