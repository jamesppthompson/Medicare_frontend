import { TestBed } from '@angular/core/testing';

import { RouteConstantsService } from './route-constants.service';

describe('RouteConstantsService', () => {
  let service: RouteConstantsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouteConstantsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
