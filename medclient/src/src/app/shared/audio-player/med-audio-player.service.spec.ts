import { TestBed } from '@angular/core/testing';

import { MedAudioPlayerService } from './med-audio-player.service';

describe('MedAudioPlayerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MedAudioPlayerService = TestBed.get(MedAudioPlayerService);
    expect(service).toBeTruthy();
  });
});
