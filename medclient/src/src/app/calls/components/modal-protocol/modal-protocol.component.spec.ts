import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalProtocolComponent } from './modal-protocol.component';

describe('ModalProtocolComponent', () => {
  let component: ModalProtocolComponent;
  let fixture: ComponentFixture<ModalProtocolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalProtocolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalProtocolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
