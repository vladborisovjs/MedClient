import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardProtocolComponent } from './card-protocol.component';

describe('CardProtocolComponent', () => {
  let component: CardProtocolComponent;
  let fixture: ComponentFixture<CardProtocolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardProtocolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardProtocolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
