import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddDrugToBagComponent } from './modal-add-drug-to-bag.component';

describe('ModalAddDrugToBagComponent', () => {
  let component: ModalAddDrugToBagComponent;
  let fixture: ComponentFixture<ModalAddDrugToBagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAddDrugToBagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddDrugToBagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
