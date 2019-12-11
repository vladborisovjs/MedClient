import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugBagTemplatesItemComponent } from './drug-bag-templates-item.component';

describe('DrugBagTemplatesItemComponent', () => {
  let component: DrugBagTemplatesItemComponent;
  let fixture: ComponentFixture<DrugBagTemplatesItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrugBagTemplatesItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugBagTemplatesItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
