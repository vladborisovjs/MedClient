import { TestBed } from '@angular/core/testing';

import { UserLogsService } from './user-logs.service';

describe('UserLogsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserLogsService = TestBed.get(UserLogsService);
    expect(service).toBeTruthy();
  });
});
