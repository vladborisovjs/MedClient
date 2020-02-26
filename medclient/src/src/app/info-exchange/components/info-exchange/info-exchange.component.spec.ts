import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoExchangeComponent } from './info-exchange.component';

describe('InfoExchangeComponent', () => {
  let component: InfoExchangeComponent;
  let fixture: ComponentFixture<InfoExchangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoExchangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoExchangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
