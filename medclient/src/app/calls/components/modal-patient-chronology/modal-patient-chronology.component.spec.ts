import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPatientChronologyComponent } from './modal-patient-chronology.component';

describe('ModalPatientChronologyComponent', () => {
  let component: ModalPatientChronologyComponent;
  let fixture: ComponentFixture<ModalPatientChronologyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPatientChronologyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPatientChronologyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
