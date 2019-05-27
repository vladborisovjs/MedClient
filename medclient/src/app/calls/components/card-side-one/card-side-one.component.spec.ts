import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardSideOneComponent } from './card-side-one.component';

describe('CardSideOneComponent', () => {
  let component: CardSideOneComponent;
  let fixture: ComponentFixture<CardSideOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardSideOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardSideOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
