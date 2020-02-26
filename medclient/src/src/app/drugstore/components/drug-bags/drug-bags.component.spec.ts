import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugBagsComponent } from './drug-bags.component';

describe('DrugBagsComponent', () => {
  let component: DrugBagsComponent;
  let fixture: ComponentFixture<DrugBagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrugBagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugBagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
