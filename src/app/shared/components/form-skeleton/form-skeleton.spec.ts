import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSkeleton } from './form-skeleton';

describe('FormSkeleton', () => {
  let component: FormSkeleton;
  let fixture: ComponentFixture<FormSkeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormSkeleton],
    }).compileComponents();

    fixture = TestBed.createComponent(FormSkeleton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
