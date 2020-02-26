import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPerformerShiftListComponent } from './modal-performer-shift-list.component';

describe('ModalPerformerShiftListComponent', () => {
  let component: ModalPerformerShiftListComponent;
  let fixture: ComponentFixture<ModalPerformerShiftListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPerformerShiftListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPerformerShiftListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
