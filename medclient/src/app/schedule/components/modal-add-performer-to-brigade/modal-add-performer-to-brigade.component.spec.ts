import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddPerformerToBrigadeComponent } from './modal-add-performer-to-brigade.component';

describe('ModalAddPerformerToBrigadeComponent', () => {
  let component: ModalAddPerformerToBrigadeComponent;
  let fixture: ComponentFixture<ModalAddPerformerToBrigadeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAddPerformerToBrigadeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddPerformerToBrigadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
