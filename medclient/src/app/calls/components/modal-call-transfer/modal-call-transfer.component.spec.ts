import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCallTransferComponent } from './modal-call-transfer.component';

describe('ModalCallTransferComponent', () => {
  let component: ModalCallTransferComponent;
  let fixture: ComponentFixture<ModalCallTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCallTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCallTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
