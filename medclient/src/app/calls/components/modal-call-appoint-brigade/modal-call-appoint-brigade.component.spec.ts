import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCallAppointBrigadeComponent } from './modal-call-appoint-brigade.component';

describe('ModalCallAppointBrigadeComponent', () => {
  let component: ModalCallAppointBrigadeComponent;
  let fixture: ComponentFixture<ModalCallAppointBrigadeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCallAppointBrigadeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCallAppointBrigadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
