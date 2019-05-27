import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCallConfirmBrigadeComponent } from './modal-call-confirm-brigade.component';

describe('ModalCallConfirmBrigadeComponent', () => {
  let component: ModalCallConfirmBrigadeComponent;
  let fixture: ComponentFixture<ModalCallConfirmBrigadeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCallConfirmBrigadeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCallConfirmBrigadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
