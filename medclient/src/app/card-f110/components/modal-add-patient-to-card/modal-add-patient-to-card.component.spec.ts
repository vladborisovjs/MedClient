import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddPatientToCardComponent } from './modal-add-patient-to-card.component';

describe('ModalAddPatientToCardComponent', () => {
  let component: ModalAddPatientToCardComponent;
  let fixture: ComponentFixture<ModalAddPatientToCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAddPatientToCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddPatientToCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
