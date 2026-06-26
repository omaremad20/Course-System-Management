import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseCardSkeleton } from './course-card-skeleton';

describe('CourseCardSkeleton', () => {
  let component: CourseCardSkeleton;
  let fixture: ComponentFixture<CourseCardSkeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseCardSkeleton],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseCardSkeleton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
