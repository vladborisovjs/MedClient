import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallItemBrigadesComponent } from './call-item-brigades.component';

describe('CallItemBrigadesComponent', () => {
  let component: CallItemBrigadesComponent;
  let fixture: ComponentFixture<CallItemBrigadesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallItemBrigadesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallItemBrigadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
