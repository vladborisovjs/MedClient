import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCallF110Component } from './modal-call-f110.component';

describe('ModalCallF110Component', () => {
  let component: ModalCallF110Component;
  let fixture: ComponentFixture<ModalCallF110Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCallF110Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCallF110Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
