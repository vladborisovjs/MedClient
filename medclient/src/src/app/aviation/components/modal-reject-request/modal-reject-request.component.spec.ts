import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRejectRequestComponent } from './modal-reject-request.component';

describe('ModalRejectRequestComponent', () => {
  let component: ModalRejectRequestComponent;
  let fixture: ComponentFixture<ModalRejectRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalRejectRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalRejectRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
