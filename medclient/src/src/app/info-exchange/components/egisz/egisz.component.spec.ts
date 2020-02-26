import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EgiszComponent } from './egisz.component';

describe('EgiszComponent', () => {
  let component: EgiszComponent;
  let fixture: ComponentFixture<EgiszComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EgiszComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EgiszComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
