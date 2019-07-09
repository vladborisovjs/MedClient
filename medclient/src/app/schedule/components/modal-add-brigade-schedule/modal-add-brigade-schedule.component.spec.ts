import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddBrigadeScheduleComponent } from './modal-add-brigade-schedule.component';

describe('ModalAddBrigadeScheduleComponent', () => {
  let component: ModalAddBrigadeScheduleComponent;
  let fixture: ComponentFixture<ModalAddBrigadeScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAddBrigadeScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddBrigadeScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
