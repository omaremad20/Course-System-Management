import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseDetailsSkeleton } from './course-details-skeleton';

describe('CourseDetailsSkeleton', () => {
  let component: CourseDetailsSkeleton;
  let fixture: ComponentFixture<CourseDetailsSkeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseDetailsSkeleton],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseDetailsSkeleton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
