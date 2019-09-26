import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardSideTwoComponent } from './card-side-two.component';

describe('CardSideTwoComponent', () => {
  let component: CardSideTwoComponent;
  let fixture: ComponentFixture<CardSideTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardSideTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardSideTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
