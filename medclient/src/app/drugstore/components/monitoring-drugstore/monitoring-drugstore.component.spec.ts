import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringDrugstoreComponent } from './monitoring-drugstore.component';

describe('MonitoringDrugstoreComponent', () => {
  let component: MonitoringDrugstoreComponent;
  let fixture: ComponentFixture<MonitoringDrugstoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoringDrugstoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringDrugstoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
