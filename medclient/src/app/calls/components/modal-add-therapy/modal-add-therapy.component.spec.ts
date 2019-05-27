import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddTherapyComponent } from './modal-add-therapy.component';

describe('ModalAddTherapyComponent', () => {
  let component: ModalAddTherapyComponent;
  let fixture: ComponentFixture<ModalAddTherapyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAddTherapyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddTherapyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
