import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCallPatientArchiveComponent } from './modal-call-patient-archive.component';

describe('ModalCallPatientArchiveComponent', () => {
  let component: ModalCallPatientArchiveComponent;
  let fixture: ComponentFixture<ModalCallPatientArchiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCallPatientArchiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCallPatientArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
