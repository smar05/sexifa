import { TestBed } from '@angular/core/testing';

import { ViewsModelService } from './views-model.service';

describe('ViewsModelService', () => {
  let service: ViewsModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewsModelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
