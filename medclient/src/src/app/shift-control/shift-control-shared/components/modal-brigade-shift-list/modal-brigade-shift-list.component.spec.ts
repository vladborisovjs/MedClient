import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBrigadeShiftListComponent } from './modal-brigade-shift-list.component';

describe('ModalBrigadeShiftListComponent', () => {
  let component: ModalBrigadeShiftListComponent;
  let fixture: ComponentFixture<ModalBrigadeShiftListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalBrigadeShiftListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalBrigadeShiftListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
