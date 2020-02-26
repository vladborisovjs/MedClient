import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCardResultTherapyWithBagComponent } from './modal-card-result-therapy-with-bag.component';

describe('ModalCardResultTherapy2Component', () => {
  let component: ModalCardResultTherapyWithBagComponent;
  let fixture: ComponentFixture<ModalCardResultTherapyWithBagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCardResultTherapyWithBagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCardResultTherapyWithBagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
