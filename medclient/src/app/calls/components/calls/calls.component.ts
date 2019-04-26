import { Component, OnInit } from '@angular/core';
// import {MedApi} from '../../../../../swagger/med-api.service';


@Component({
  selector: 'app-calls',
  templateUrl: './calls.component.html',
  styleUrls: ['./calls.component.scss']
})
export class CallsComponent implements OnInit {
  panelOpenState = false;
  colDefs = [
    {
      headerName: 'Номер',
      field: 'number',
      sortable: true,
      filter: true
    },
    {
      headerName: 'Дата',
      field: 'date',
      sortable: true,
      filter: true
    },
    {
      headerName: 'Заявитель',
      field: 'declarant_name',
      sortable: true,
      filter: true
    },
    {
      headerName: 'Заявитель',
      field: 'declarant_name',
      sortable: true,
      filter: true
    },
    {
      headerName: 'Повод к вызову',
      field: 'reason_name',
      sortable: true,
      filter: true
    },
  ];
  listSource = [
    {
      id: 408346,
      call_id: 408346,
      date: '2019-04-15T18:48:55',
      number: '87',
      call_status: 1,
      call_status_name: 'Не принят бригадой',
      reason_id: 337700,
      reason_name: 'Несчастный случай',
      declarant_name: '',
      declarant_phone: '',
      address: 'Ленина пр-кт, д. 2, Тосно г, Тосненский р-н р-н, Ленинградская обл.',
      district_name: 'Тосненский р-н',
      subdivision_id: 120,
      subdivision_name: 'Тосненское ОСМП',
      subdivision_send_id: 120,
      subdivision_send_name: 'Тосненское ОСМП',
      performer_id: 1300,
      performer_name: 'Ф.Х.Капустин',
      performer_send_id: 1300,
      performer_send_name: 'Ф.Х.Капустин',
      performer_accept_id: 1300,
      performer_accept_name: 'Ф.Х.Капустин',
      longitude: 30.866149,
      latitude: 59.548212,
      is_unfounded: false,
      patients: 'И.И.ПЕТРОВ',
      brigades: 'ТОСН_4/150419, ТОСН_3/150419, ТОСН_2/150419'
    },
    {
      id: 408326,
      call_id: 408326,
      date: '2019-04-15T18:12:37',
      number: '88',
      call_status: 2,
      call_status_name: 'В работе',
      reason_id: 1568,
      reason_name: 'Ранение руки при раб. с механ., б/созн, ребенок',
      declarant_name: 'Николай Ефремович',
      declarant_phone: '8-911-236-99-99',
      address: 'Барыбина, д. 29б, Тосно, Тосненский р-н, Ленинградская обл.',
      district_name: 'Тосненский',
      subdivision_id: 120,
      subdivision_name: 'Тосненское ОСМП',
      subdivision_send_id: 120145,
      subdivision_send_name: 'Служба 112',
      performer_id: 336821,
      performer_name: 'В.А.Дмитриев',
      performer_send_id: 336821,
      performer_send_name: 'В.А.Дмитриев',
      performer_accept_id: 1300,
      performer_accept_name: 'Ф.Х.Капустин',
      longitude: null,
      latitude: null,
      is_unfounded: null,
      patients: 'И.Е.Петров',
      brigades: 'ТОСН_1/180419'
    },
    {
      id: 408300,
      call_id: 408300,
      date: '2019-04-12T12:09:40',
      number: '86',
      call_status: 3,
      call_status_name: 'Исполнен',
      reason_id: 337701,
      reason_name: 'Внезапное заболевание',
      declarant_name: '',
      declarant_phone: '',
      address: 'Социалистическая ул, д. 12а, Тосно г, Тосненский р-н р-н, Ленинградская обл.',
      district_name: 'Тосненский р-н',
      subdivision_id: 120,
      subdivision_name: 'Тосненское ОСМП',
      subdivision_send_id: 120,
      subdivision_send_name: 'Тосненское ОСМП',
      performer_id: 1300,
      performer_name: 'Ф.Х.Капустин',
      performer_send_id: 1300,
      performer_send_name: 'Ф.Х.Капустин',
      performer_accept_id: 1300,
      performer_accept_name: 'Ф.Х.Капустин',
      longitude: 30.896377,
      latitude: 59.528605,
      is_unfounded: false,
      patients: 'D.John',
      brigades: 'ТОСН_1/110419'
    },
    {
      id: 408244,
      call_id: 408244,
      date: '2019-03-25T18:18:32',
      number: '85',
      call_status: 3,
      call_status_name: 'Исполнен',
      reason_id: 337705,
      reason_name: 'Перевозка',
      declarant_name: '',
      declarant_phone: '',
      address: 'Тосненский р-н р-н, Ленинградская обл.',
      district_name: 'Тосненский р-н',
      subdivision_id: 120,
      subdivision_name: 'Тосненское ОСМП',
      subdivision_send_id: 120,
      subdivision_send_name: 'Тосненское ОСМП',
      performer_id: 1300,
      performer_name: 'Ф.Х.Капустин',
      performer_send_id: 1300,
      performer_send_name: 'Ф.Х.Капустин',
      performer_accept_id: 1300,
      performer_accept_name: 'Ф.Х.Капустин',
      longitude: null,
      latitude: null,
      is_unfounded: false,
      patients: null,
      brigades: 'ТОСН_1/050419, ТОСН_6/210319, ТОСН_4/210319'
    }
  ];

  // constructor(private api: MedApi) { }

  ngOnInit() {
    // this.api.subdivisionsCallsGet(120).subscribe(
    //   el => {
    //     console.log(el)
    //   }
    // );

  }

}
