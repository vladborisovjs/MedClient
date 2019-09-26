import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCallBrigadeStatusesComponent } from './modal-call-brigade-statuses.component';

describe('ModalCallBrigadeStatusesComponent', () => {
  let component: ModalCallBrigadeStatusesComponent;
  let fixture: ComponentFixture<ModalCallBrigadeStatusesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCallBrigadeStatusesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCallBrigadeStatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
