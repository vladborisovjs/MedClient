import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UkioMessagesComponent } from './ukio-messages.component';

describe('UkioMessagesComponent', () => {
  let component: UkioMessagesComponent;
  let fixture: ComponentFixture<UkioMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UkioMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UkioMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
