import { TestBed } from '@angular/core/testing';

import { PerplexityService } from './perplexity.service';

describe('PerplexityService', () => {
  let service: PerplexityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PerplexityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
