import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBrigadeAddTransportComponent } from './modal-brigade-add-transport.component';

describe('ModalBrigadeAddTransportComponent', () => {
  let component: ModalBrigadeAddTransportComponent;
  let fixture: ComponentFixture<ModalBrigadeAddTransportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalBrigadeAddTransportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalBrigadeAddTransportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
