import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrigadesComponent } from './brigades.component';

describe('BrigadesComponent', () => {
  let component: BrigadesComponent;
  let fixture: ComponentFixture<BrigadesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrigadesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrigadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
