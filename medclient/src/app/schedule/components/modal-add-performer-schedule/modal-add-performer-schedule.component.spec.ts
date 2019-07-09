import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddPerformerScheduleComponent } from './modal-add-performer-schedule.component';

describe('ModalAddPerformerScheduleComponent', () => {
  let component: ModalAddPerformerScheduleComponent;
  let fixture: ComponentFixture<ModalAddPerformerScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAddPerformerScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddPerformerScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
