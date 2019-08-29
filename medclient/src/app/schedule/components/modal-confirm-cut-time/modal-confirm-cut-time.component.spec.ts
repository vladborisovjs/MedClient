import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfirmCutTimeComponent } from './modal-confirm-cut-time.component';

describe('ModalConfirmCutTimeComponent', () => {
  let component: ModalConfirmCutTimeComponent;
  let fixture: ComponentFixture<ModalConfirmCutTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalConfirmCutTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalConfirmCutTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
