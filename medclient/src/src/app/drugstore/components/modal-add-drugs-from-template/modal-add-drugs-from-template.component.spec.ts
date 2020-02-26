import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddDrugsFromTemplateComponent } from './modal-add-drugs-from-template.component';

describe('ModalAddDrugsFromTemplateComponent', () => {
  let component: ModalAddDrugsFromTemplateComponent;
  let fixture: ComponentFixture<ModalAddDrugsFromTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAddDrugsFromTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddDrugsFromTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
