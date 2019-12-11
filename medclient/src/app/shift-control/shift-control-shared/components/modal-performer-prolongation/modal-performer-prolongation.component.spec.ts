import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPerformerProlongationComponent } from './modal-performer-prolongation.component';

describe('ModalPerformerProlongationComponent', () => {
  let component: ModalPerformerProlongationComponent;
  let fixture: ComponentFixture<ModalPerformerProlongationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPerformerProlongationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPerformerProlongationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
