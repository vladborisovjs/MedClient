import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreateCallComponent } from './modal-create-call.component';

describe('ModalCreateCallComponent', () => {
  let component: ModalCreateCallComponent;
  let fixture: ComponentFixture<ModalCreateCallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCreateCallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCreateCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
