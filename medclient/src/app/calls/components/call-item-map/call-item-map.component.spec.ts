import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallItemMapComponent } from './call-item-map.component';

describe('CallItemMapComponent', () => {
  let component: CallItemMapComponent;
  let fixture: ComponentFixture<CallItemMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallItemMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallItemMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
