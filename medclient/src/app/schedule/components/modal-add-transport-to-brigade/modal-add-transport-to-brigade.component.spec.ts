import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddTransportToBrigadeComponent } from './modal-add-transport-to-brigade.component';

describe('ModalAddTransportToBrigadeComponent', () => {
  let component: ModalAddTransportToBrigadeComponent;
  let fixture: ComponentFixture<ModalAddTransportToBrigadeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAddTransportToBrigadeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddTransportToBrigadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
