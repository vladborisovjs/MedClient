import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullAddressComponent } from './full-address.component';

describe('FullAddressComponent', () => {
  let component: FullAddressComponent;
  let fixture: ComponentFixture<FullAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
