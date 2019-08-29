import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BestMapComponent } from './best-map.component';

describe('BestMapComponent', () => {
  let component: BestMapComponent;
  let fixture: ComponentFixture<BestMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BestMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BestMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
