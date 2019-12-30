import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallsTableComponent } from './calls-table.component';

describe('CallsTableComponent', () => {
  let component: CallsTableComponent;
  let fixture: ComponentFixture<CallsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
