import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAviaRequestInfoComponent } from './modal-avia-request-info.component';

describe('ModalAviaRequestInfoComponent', () => {
  let component: ModalAviaRequestInfoComponent;
  let fixture: ComponentFixture<ModalAviaRequestInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAviaRequestInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAviaRequestInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
