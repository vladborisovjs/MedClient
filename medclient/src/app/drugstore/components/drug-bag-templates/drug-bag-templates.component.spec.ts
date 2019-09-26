import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugBagTemplatesComponent } from './drug-bag-templates.component';

describe('DrugBagTemplatesComponent', () => {
  let component: DrugBagTemplatesComponent;
  let fixture: ComponentFixture<DrugBagTemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrugBagTemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugBagTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
