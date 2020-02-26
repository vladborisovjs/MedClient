import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AviationComponent } from './aviation.component';

describe('AviationComponent', () => {
  let component: AviationComponent;
  let fixture: ComponentFixture<AviationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AviationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AviationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
