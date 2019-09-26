import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AviationRequestsComponent } from './aviation-requests.component';

describe('AviationRequestsComponent', () => {
  let component: AviationRequestsComponent;
  let fixture: ComponentFixture<AviationRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AviationRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AviationRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
