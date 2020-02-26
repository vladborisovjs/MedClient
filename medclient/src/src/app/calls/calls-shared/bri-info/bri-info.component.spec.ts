import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BriInfoComponent } from './bri-info.component';

describe('BriInfoComponent', () => {
  let component: BriInfoComponent;
  let fixture: ComponentFixture<BriInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BriInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BriInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
