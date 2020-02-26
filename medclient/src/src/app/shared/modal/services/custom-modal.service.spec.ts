import { TestBed } from '@angular/core/testing';

import { CustomModalService } from './custom-modal.service';

describe('CustomModalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomModalService = TestBed.get(CustomModalService);
    expect(service).toBeTruthy();
  });
});
