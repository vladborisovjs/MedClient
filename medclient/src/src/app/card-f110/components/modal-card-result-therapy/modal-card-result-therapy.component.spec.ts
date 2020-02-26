import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCardResultTherapyComponent } from './modal-card-result-therapy.component';

describe('ModalCardResultTherapyComponent', () => {
  let component: ModalCardResultTherapyComponent;
  let fixture: ComponentFixture<ModalCardResultTherapyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCardResultTherapyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCardResultTherapyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
