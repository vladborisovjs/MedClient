import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedMapComponent } from './med-map.component';

describe('MedMapComponent', () => {
  let component: MedMapComponent;
  let fixture: ComponentFixture<MedMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
