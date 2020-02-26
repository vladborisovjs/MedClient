import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSubdivisionTreeComponent } from './modal-subdivision-tree.component';

describe('ModalSubdivisionTreeComponent', () => {
  let component: ModalSubdivisionTreeComponent;
  let fixture: ComponentFixture<ModalSubdivisionTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalSubdivisionTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSubdivisionTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
