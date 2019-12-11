import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPerformerUpdateShiftComponent } from './modal-performer-update-shift.component';

describe('ModalPerformerCreateShiftComponent', () => {
  let component: ModalPerformerUpdateShiftComponent;
  let fixture: ComponentFixture<ModalPerformerUpdateShiftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPerformerUpdateShiftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPerformerUpdateShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
