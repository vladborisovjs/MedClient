import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncommingCallComponent } from './incomming-call.component';

describe('IncommingCallComponent', () => {
  let component: IncommingCallComponent;
  let fixture: ComponentFixture<IncommingCallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncommingCallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncommingCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
