import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalIncomingAviationComponent } from './modal-incoming-aviation.component';

describe('ModalIncomingAviationComponent', () => {
  let component: ModalIncomingAviationComponent;
  let fixture: ComponentFixture<ModalIncomingAviationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalIncomingAviationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalIncomingAviationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
