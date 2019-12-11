import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftTableBrigadeComponent } from './shift-table-brigade.component';

describe('ShiftTableBrigadeComponent', () => {
  let component: ShiftTableBrigadeComponent;
  let fixture: ComponentFixture<ShiftTableBrigadeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiftTableBrigadeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftTableBrigadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
