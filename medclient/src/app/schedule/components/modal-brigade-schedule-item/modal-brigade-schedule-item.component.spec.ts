import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBrigadeScheduleItemComponent } from './modal-brigade-schedule-item.component';

describe('ModalBrigadeScheduleItemComponent', () => {
  let component: ModalBrigadeScheduleItemComponent;
  let fixture: ComponentFixture<ModalBrigadeScheduleItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalBrigadeScheduleItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalBrigadeScheduleItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
