import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAviationRequestComponent } from './modal-aviation-request.component';

describe('ModalAviationRequestComponent', () => {
  let component: ModalAviationRequestComponent;
  let fixture: ComponentFixture<ModalAviationRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAviationRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAviationRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
