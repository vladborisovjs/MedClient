import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrigadesControlComponent } from './brigades-control.component';

describe('BrigadesControlComponent', () => {
  let component: BrigadesControlComponent;
  let fixture: ComponentFixture<BrigadesControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrigadesControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrigadesControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
