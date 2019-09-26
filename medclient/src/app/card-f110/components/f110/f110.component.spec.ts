import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { F110Component } from './f110.component';

describe('F110Component', () => {
  let component: F110Component;
  let fixture: ComponentFixture<F110Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ F110Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(F110Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
