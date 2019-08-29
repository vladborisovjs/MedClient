import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMkb10DiagnosisComponent } from './modal-mkb10-diagnosis.component';

describe('ModalMkb10DiagnosisComponent', () => {
  let component: ModalMkb10DiagnosisComponent;
  let fixture: ComponentFixture<ModalMkb10DiagnosisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalMkb10DiagnosisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalMkb10DiagnosisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
