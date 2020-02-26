import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardAnamnesisComponent } from './card-anamnesis.component';

describe('CardAnamnesisComponent', () => {
  let component: CardAnamnesisComponent;
  let fixture: ComponentFixture<CardAnamnesisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardAnamnesisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardAnamnesisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
