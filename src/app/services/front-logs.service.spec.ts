import { TestBed } from '@angular/core/testing';

import { FrontLogsService } from './front-logs.service';

describe('FrontLogsService', () => {
  let service: FrontLogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FrontLogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
