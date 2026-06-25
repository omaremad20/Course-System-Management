import { TestBed } from '@angular/core/testing';

import { CoursesService } from './courses';

describe('Course', () => {
  let service: CoursesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoursesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
