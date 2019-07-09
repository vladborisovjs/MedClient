import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalProlongationComponent } from './modal-prolongation.component';

describe('ModalProlongationComponent', () => {
  let component: ModalProlongationComponent;
  let fixture: ComponentFixture<ModalProlongationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalProlongationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalProlongationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
