import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddDrugsComponent } from './modal-add-drugs.component';

describe('ModalAddDrugsComponent', () => {
  let component: ModalAddDrugsComponent;
  let fixture: ComponentFixture<ModalAddDrugsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAddDrugsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddDrugsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
