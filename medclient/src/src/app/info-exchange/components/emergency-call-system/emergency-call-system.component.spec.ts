import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmergencyCallSystemComponent } from './emergency-call-system.component';

describe('EmergencyCallSystemComponent', () => {
  let component: EmergencyCallSystemComponent;
  let fixture: ComponentFixture<EmergencyCallSystemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmergencyCallSystemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmergencyCallSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
