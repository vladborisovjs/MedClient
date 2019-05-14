import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDeclarantUpdateComponent } from './modal-declarant-update.component';

describe('ModalDeclarantUpdateComponent', () => {
  let component: ModalDeclarantUpdateComponent;
  let fixture: ComponentFixture<ModalDeclarantUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDeclarantUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDeclarantUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
