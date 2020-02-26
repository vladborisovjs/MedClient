import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallsContainerComponent } from './calls-container.component';

describe('CallsContainerComponent', () => {
  let component: CallsContainerComponent;
  let fixture: ComponentFixture<CallsContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallsContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
