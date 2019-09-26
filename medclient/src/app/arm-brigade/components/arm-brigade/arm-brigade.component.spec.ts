import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArmBrigadeComponent } from './arm-brigade.component';

describe('ArmBrigadeComponent', () => {
  let component: ArmBrigadeComponent;
  let fixture: ComponentFixture<ArmBrigadeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArmBrigadeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArmBrigadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
