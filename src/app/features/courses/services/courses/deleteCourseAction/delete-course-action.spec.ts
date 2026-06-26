import { TestBed } from '@angular/core/testing';

import { DeleteCourseAction } from './delete-course-action';

describe('DeleteCourseAction', () => {
  let service: DeleteCourseAction;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeleteCourseAction);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
