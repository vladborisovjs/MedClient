import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUkioIncomingComponent } from './modal-ukio-incoming.component';

describe('ModalUkioIncomingComponent', () => {
  let component: ModalUkioIncomingComponent;
  let fixture: ComponentFixture<ModalUkioIncomingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalUkioIncomingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalUkioIncomingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
