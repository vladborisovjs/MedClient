import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBrigadeUpdateShiftComponent } from './modal-brigade-update-shift.component';

describe('ModalBrigadeUpdateShiftComponent', () => {
  let component: ModalBrigadeUpdateShiftComponent;
  let fixture: ComponentFixture<ModalBrigadeUpdateShiftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalBrigadeUpdateShiftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalBrigadeUpdateShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
