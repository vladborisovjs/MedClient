import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalProlongationDeleteComponent } from './modal-prolongation-delete.component';

describe('ModalProlongationDeleteComponent', () => {
  let component: ModalProlongationDeleteComponent;
  let fixture: ComponentFixture<ModalProlongationDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalProlongationDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalProlongationDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
