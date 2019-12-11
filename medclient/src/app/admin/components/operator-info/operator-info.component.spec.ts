import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorInfoComponent } from './operator-info.component';

describe('OperatorInfoComponent', () => {
  let component: OperatorInfoComponent;
  let fixture: ComponentFixture<OperatorInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperatorInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
