import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyCoursesState } from './empty-courses-state';

describe('EmptyCoursesState', () => {
  let component: EmptyCoursesState;
  let fixture: ComponentFixture<EmptyCoursesState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyCoursesState],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyCoursesState);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
