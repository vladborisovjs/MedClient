import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCallTransferAvailableComponent } from './modal-call-transfer-available.component';

describe('ModalCallTransferAvailableComponent', () => {
  let component: ModalCallTransferAvailableComponent;
  let fixture: ComponentFixture<ModalCallTransferAvailableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCallTransferAvailableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCallTransferAvailableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
