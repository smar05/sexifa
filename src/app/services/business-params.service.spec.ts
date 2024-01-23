import { TestBed } from '@angular/core/testing';

import { BusinessParamsService } from './business-params.service';

describe('BusinessParamsService', () => {
  let service: BusinessParamsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessParamsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
