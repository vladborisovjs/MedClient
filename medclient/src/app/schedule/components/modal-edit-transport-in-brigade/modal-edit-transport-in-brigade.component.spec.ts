import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditTransportInBrigadeComponent } from './modal-edit-transport-in-brigade.component';

describe('ModalEditTransportInBrigadeComponent', () => {
  let component: ModalEditTransportInBrigadeComponent;
  let fixture: ComponentFixture<ModalEditTransportInBrigadeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalEditTransportInBrigadeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEditTransportInBrigadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
