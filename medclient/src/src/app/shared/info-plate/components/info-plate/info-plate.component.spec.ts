import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPlateComponent } from './info-plate.component';

describe('InfoPlateComponent', () => {
  let component: InfoPlateComponent;
  let fixture: ComponentFixture<InfoPlateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoPlateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPlateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
