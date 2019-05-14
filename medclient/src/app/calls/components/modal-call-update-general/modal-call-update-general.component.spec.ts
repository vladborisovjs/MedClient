import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCallUpdateGeneralComponent } from './modal-call-update-general.component';

describe('ModalCallUpdateGeneralComponent', () => {
  let component: ModalCallUpdateGeneralComponent;
  let fixture: ComponentFixture<ModalCallUpdateGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCallUpdateGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCallUpdateGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
