import { TestBed } from '@angular/core/testing';

import { AuthgardService } from './authgard.service';

describe('AuthgardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthgardService = TestBed.get(AuthgardService);
    expect(service).toBeTruthy();
  });
});
