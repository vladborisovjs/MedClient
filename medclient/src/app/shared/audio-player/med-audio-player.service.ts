import { Injectable } from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CallAudioComponent} from "./call-audio/call-audio.component";

@Injectable()
export class MedAudioPlayerService {

  constructor(private modal: NgbModal) { }

  openPlayer(callId: number){
    const ap = this.modal.open(CallAudioComponent);
    ap.componentInstance.callId = callId;
  }
}
