import {Component, Inject, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {API_BASE_URL, MedApi} from "../../../../../swagger/med-api.service";
import {take} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-call-audio',
  templateUrl: './call-audio.component.html',
  styleUrls: ['./call-audio.component.scss']
})
export class CallAudioComponent implements OnInit {
@Input() callId: number;
loading: boolean;
audioList: any[];
  constructor(private modalInstance: NgbActiveModal, private api: MedApi, private http: HttpClient, private domSanitizer: DomSanitizer,  @Inject(API_BASE_URL) public apiUrl?: string) { }

  ngOnInit() {
    this.getAudioList();
  }

  back() {
    this.modalInstance.dismiss();
  }

  getAudioList(){
    this.loading = true;
    this.api.getFileListUsingGET(this.callId).pipe(take(1)).subscribe(
      audioList => {
        this.audioList = audioList;
        // audioList.forEach(
        //   el => this.createBlob(el)
        // );
        this.loading = false;
      }
    );
  }

  getAudioLink(audio) {
    this.http.get('http://localhost:4200/api/andy/call/audio/download/'+audio.id).pipe(take(1)).subscribe(
      audioLink => {
        // console.log(window.URL.createObjectURL(audioLink));
        console.log(audioLink);
        // audio.link = this.san(window.URL.createObjectURL(audioLink));
        console.log(audio.link);
        // console.log(audio.link);
        audio.link = audioLink;
        this.loading = false;
        // window.open(audio.link);
      }
    );



    // console.log('get link', audio.id);
    // audio.link ='http://localhost:4200/api/andy/call/audio/preview/'+audio.id;
    // this.api.downloadFileUsingGET(audio.id).pipe(take(1)).subscribe(
    //   audioLink => {
    //     console.log(audioLink);
    //     audio.link = audioLink;
    //   }
    // )
  }
  san(url){
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }
}
