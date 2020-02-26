import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalOverdueCallComponent } from './modal-overdue-call.component';

describe('ModalOverdueCallComponent', () => {
  let component: ModalOverdueCallComponent;
  let fixture: ComponentFixture<ModalOverdueCallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalOverdueCallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalOverdueCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
