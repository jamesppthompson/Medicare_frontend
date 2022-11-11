import { TestBed } from '@angular/core/testing';

import { AgreementRestService } from './agreement-rest.service';

describe('AgreementRestService', () => {
  let service: AgreementRestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgreementRestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
