import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftControlComponent } from './shift-control.component';

describe('ShiftControlComponent', () => {
  let component: ShiftControlComponent;
  let fixture: ComponentFixture<ShiftControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiftControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
