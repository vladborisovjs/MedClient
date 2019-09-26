import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardSideOnePatientComponent } from './card-side-one-patient.component';

describe('CardSideOnePatientComponent', () => {
  let component: CardSideOnePatientComponent;
  let fixture: ComponentFixture<CardSideOnePatientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardSideOnePatientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardSideOnePatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
