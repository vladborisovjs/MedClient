import { TestBed } from '@angular/core/testing';

import { CallItemService } from './call-item.service';

describe('CallItemService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CallItemService = TestBed.get(CallItemService);
    expect(service).toBeTruthy();
  });
});
