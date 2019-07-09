import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPerformerScheduleListComponent } from './modal-performer-schedule-list.component';

describe('ModalPerformerScheduleListComponent', () => {
  let component: ModalPerformerScheduleListComponent;
  let fixture: ComponentFixture<ModalPerformerScheduleListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPerformerScheduleListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPerformerScheduleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
