import { TestBed } from '@angular/core/testing';

import { MetodosDePagoService } from './metodos-de-pago.service';

describe('MetodosDePagoService', () => {
  let service: MetodosDePagoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetodosDePagoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
