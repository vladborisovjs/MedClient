import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSimilarCallsComponent } from './modal-similar-calls.component';

describe('ModalSimilarCallsComponent', () => {
  let component: ModalSimilarCallsComponent;
  let fixture: ComponentFixture<ModalSimilarCallsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalSimilarCallsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSimilarCallsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
