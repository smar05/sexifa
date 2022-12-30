import { TestBed } from '@angular/core/testing';

import { FontAwesomeIconsService } from './font-awesome-icons.service';

describe('FontAwesomeIconsService', () => {
  let service: FontAwesomeIconsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FontAwesomeIconsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
