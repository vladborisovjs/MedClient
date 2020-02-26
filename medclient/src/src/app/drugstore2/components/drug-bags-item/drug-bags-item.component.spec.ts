import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugBagsItemComponent } from './drug-bags-item.component';

describe('DrugBagsItemComponent', () => {
  let component: DrugBagsItemComponent;
  let fixture: ComponentFixture<DrugBagsItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrugBagsItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugBagsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
