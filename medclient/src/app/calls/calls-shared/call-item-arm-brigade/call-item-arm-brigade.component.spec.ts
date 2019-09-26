import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallItemArmBrigadeComponent } from './call-item-arm-brigade.component';

describe('CallItemArmBrigadeComponent', () => {
  let component: CallItemArmBrigadeComponent;
  let fixture: ComponentFixture<CallItemArmBrigadeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallItemArmBrigadeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallItemArmBrigadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
