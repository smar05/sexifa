import { TestBed } from '@angular/core/testing';

import { TelegramLocalService } from './telegram-local.service';

describe('TelegramLocalService', () => {
  let service: TelegramLocalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TelegramLocalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
