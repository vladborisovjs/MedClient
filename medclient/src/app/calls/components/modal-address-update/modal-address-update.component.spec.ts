import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddressUpdateComponent } from './modal-address-update.component';

describe('ModalAddressUpdateComponent', () => {
  let component: ModalAddressUpdateComponent;
  let fixture: ComponentFixture<ModalAddressUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAddressUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddressUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
