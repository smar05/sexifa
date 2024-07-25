import { TestBed } from '@angular/core/testing';

import { AlertsPageService } from './alerts-page.service';

describe('AlertsPageService', () => {
  let service: AlertsPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertsPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
