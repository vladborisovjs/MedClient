import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CallAudioComponent} from './call-audio/call-audio.component';
import {MedAudioPlayerService} from "./med-audio-player.service";

@NgModule({
  declarations: [CallAudioComponent],
  imports: [
    CommonModule,
  ],
  providers: [
    MedAudioPlayerService
  ],
  entryComponents: [
    CallAudioComponent
  ]
})
export class AudioPlayerModule {
}
