import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Coursedetails } from './course-details';

describe('Coursedetails', () => {
  let component: Coursedetails;
  let fixture: ComponentFixture<Coursedetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Coursedetails],
    }).compileComponents();

    fixture = TestBed.createComponent(Coursedetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
