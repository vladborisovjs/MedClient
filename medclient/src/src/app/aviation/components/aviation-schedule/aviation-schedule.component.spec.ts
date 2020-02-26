import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AviationScheduleComponent } from './aviation-schedule.component';

describe('AviationScheduleComponent', () => {
  let component: AviationScheduleComponent;
  let fixture: ComponentFixture<AviationScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AviationScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AviationScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
