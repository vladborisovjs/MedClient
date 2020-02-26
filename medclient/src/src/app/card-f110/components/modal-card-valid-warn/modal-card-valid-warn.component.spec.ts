import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCardValidWarnComponent } from './modal-card-valid-warn.component';

describe('ModalCardValidWarnComponent', () => {
  let component: ModalCardValidWarnComponent;
  let fixture: ComponentFixture<ModalCardValidWarnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCardValidWarnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCardValidWarnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
