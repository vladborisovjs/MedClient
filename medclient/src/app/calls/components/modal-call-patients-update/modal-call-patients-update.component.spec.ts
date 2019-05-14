import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCallPatientsUpdateComponent } from './modal-call-patients-update.component';

describe('ModalCallPatientsUpdateComponent', () => {
  let component: ModalCallPatientsUpdateComponent;
  let fixture: ComponentFixture<ModalCallPatientsUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCallPatientsUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCallPatientsUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
