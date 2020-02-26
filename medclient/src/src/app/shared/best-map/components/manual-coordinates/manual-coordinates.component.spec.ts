import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualCoordinatesComponent } from './manual-coordinates.component';

describe('ManualCoordinatesComponent', () => {
  let component: ManualCoordinatesComponent;
  let fixture: ComponentFixture<ManualCoordinatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualCoordinatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualCoordinatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
