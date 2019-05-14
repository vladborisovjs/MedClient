import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCallAppointBrigageComponent } from './modal-call-appoint-brigage.component';

describe('ModalCallAppointBrigageComponent', () => {
  let component: ModalCallAppointBrigageComponent;
  let fixture: ComponentFixture<ModalCallAppointBrigageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCallAppointBrigageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCallAppointBrigageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
