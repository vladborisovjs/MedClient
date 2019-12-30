import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BriTableComponent } from './bri-table.component';

describe('BriTableComponent', () => {
  let component: BriTableComponent;
  let fixture: ComponentFixture<BriTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BriTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BriTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
