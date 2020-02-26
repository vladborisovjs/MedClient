import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullAddressFiasComponent } from './full-address-fias.component';

describe('FullAddressFiasComponent', () => {
  let component: FullAddressFiasComponent;
  let fixture: ComponentFixture<FullAddressFiasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullAddressFiasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullAddressFiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
