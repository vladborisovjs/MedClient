import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalF110Component } from './modal-f110.component';

describe('ModalF110Component', () => {
  let component: ModalF110Component;
  let fixture: ComponentFixture<ModalF110Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalF110Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalF110Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
