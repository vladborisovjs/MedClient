import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPerformerProlongationDeleteComponent } from './modal-performer-prolongation-delete.component';

describe('ModalPerformerProlongationDeleteComponent', () => {
  let component: ModalPerformerProlongationDeleteComponent;
  let fixture: ComponentFixture<ModalPerformerProlongationDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPerformerProlongationDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPerformerProlongationDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
