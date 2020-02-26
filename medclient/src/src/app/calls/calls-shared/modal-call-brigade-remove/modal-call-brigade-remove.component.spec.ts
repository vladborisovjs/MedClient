import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCallBrigadeRemoveComponent } from './modal-call-brigade-remove.component';

describe('ModalCallBrigadeRemoveComponent', () => {
  let component: ModalCallBrigadeRemoveComponent;
  let fixture: ComponentFixture<ModalCallBrigadeRemoveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCallBrigadeRemoveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCallBrigadeRemoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
