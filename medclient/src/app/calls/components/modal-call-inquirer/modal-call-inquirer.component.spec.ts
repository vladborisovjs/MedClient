import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCallInquirerComponent } from './modal-call-inquirer.component';

describe('ModalCallInquirerComponent', () => {
  let component: ModalCallInquirerComponent;
  let fixture: ComponentFixture<ModalCallInquirerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCallInquirerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCallInquirerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
