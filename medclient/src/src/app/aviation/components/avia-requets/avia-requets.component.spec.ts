import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AviaRequetsComponent } from './avia-requets.component';

describe('AviaRequetsComponent', () => {
  let component: AviaRequetsComponent;
  let fixture: ComponentFixture<AviaRequetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AviaRequetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AviaRequetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
