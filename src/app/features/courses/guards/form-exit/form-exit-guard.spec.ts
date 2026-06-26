import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { formExitGuard } from './form-exit-guard';

describe('formExitGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => formExitGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
